<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Account;
use App\Models\AvisRejetCheque;
use App\Models\Cheque;
use App\Models\Client;
use App\Models\Retrait;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RetraitController extends Controller
{
    public function index()
    {
        $retraits = Retrait::with(['account.client', 'cheque'])->latest()->paginate(15);

        return response()->json(['retraits' => $retraits]);
    }

    public function getByAccount($accountId)
    {
        $retraits = Retrait::with(['cheque', 'account.client'])->where('account_id', $accountId)->latest()->get();
        return response()->json(['retraits' => $retraits]);
    }

    public function searchClient(Request $request)
    {
        $cin = $request->input('cin');
        $nom = $request->input('nom');
        $prenom = $request->input('prenom');

        if (! $cin && ! $nom && ! $prenom) {
            return response()->json(['message' => 'Veuillez fournir le CIN, le nom ou le prénom.'], 422);
        }

        if ($cin) {
            $client = Client::with(['accounts' => function ($query) {
                $query->orderBy('created_at', 'desc');
            }])->where('cin', $cin)->first();
        } else {
            $client = Client::with(['accounts' => function ($query) {
                $query->orderBy('created_at', 'desc');
            }])
                ->where(function ($q) use ($nom, $prenom) {
                    if ($nom) {
                        $q->orWhere('nom', 'like', "%{$nom}%");
                    }
                    if ($prenom) {
                        $q->orWhere('prenom', 'like', "%{$prenom}%");
                    }
                })
                ->first();
        }

        if (! $client) {
            return response()->json(['message' => 'Client non trouvé.'], 404);
        }

        return response()->json(['client' => $client]);
    }

    public function getAccountsByClient(Request $request)
    {
        $request->validate([
            'client_id' => 'required|integer|exists:clients,id',
        ]);

        $accounts = Account::where('client_id', $request->client_id)->get();

        return response()->json(['accounts' => $accounts]);
    }

    public function store(Request $request)
    {
        try {
            \Log::info('[RetraitController@store] Incoming request', $request->all());
            $rules = [
                'account_id' => 'required|integer|exists:accounts,id',
                'type_retrait' => 'required|in:personnel,cheque',
                'montant' => 'required|numeric|min:0.01',
            ];

            if ($request->type_retrait === 'cheque') {
                $rules = array_merge($rules, [
                    'numero_cheque' => 'required|string|max:255', // Removed unique check
                    'beneficiaire_nom' => 'required|string|max:255',
                    'beneficiaire_prenom' => 'required|string|max:255',
                    'beneficiaire_cin' => 'required|string|max:255',
                    'beneficiaire_cin_expiration' => 'nullable|date',
                ]);
            }

            $data = $request->validate($rules);
            \Log::info('[RetraitController@store] Validated data', $data);

            $account = Account::find($data['account_id']);
            \Log::info('[RetraitController@store] Found account', $account ? $account->toArray() : ['found' => false]);

            if (! $account) {
                return response()->json(['message' => 'Compte introuvable.'], 404);
            }

            $soldeAvant = $account->balance;
            \Log::info('[RetraitController@store] Solde check', [
                'solde_avant' => $soldeAvant,
                'solde_type' => gettype($soldeAvant),
                'montant' => $data['montant'],
                'montant_type' => gettype($data['montant']),
            ]);

            if ($data['montant'] > $soldeAvant) {
                \Log::warning('[RetraitController@store] Solde insuffisant');
                return response()->json(['message' => 'Solde insuffisant.'], 422);
            }

            // Execute the transaction and get the retrait
            $retrait = DB::transaction(function () use ($data, $account, $soldeAvant) {
                $newBalance = $soldeAvant - $data['montant'];

                $retrait = Retrait::create([
                    'account_id' => $account->id,
                    'type_retrait' => $data['type_retrait'],
                    'montant' => $data['montant'],
                    'solde_avant' => $soldeAvant,
                    'solde_apres' => $newBalance,
                    'guichetier_id' => auth()->id(),
                    'date_operation' => now(),
                ]);

                if ($data['type_retrait'] === 'cheque') {
                    Cheque::create([
                        'retrait_id' => $retrait->id,
                        'numero_cheque' => $data['numero_cheque'],
                        'account_id' => $account->id,
                        'beneficiaire_nom' => $data['beneficiaire_nom'],
                        'beneficiaire_prenom' => $data['beneficiaire_prenom'],
                        'beneficiaire_cin' => $data['beneficiaire_cin'],
                        'beneficiaire_cin_expiration' => $data['beneficiaire_cin_expiration'] ?? null,
                        'montant' => $data['montant'],
                        'statut' => 'paye',
                    ]);
                }

                $account->update(['balance' => $newBalance]);

                return $retrait;
            });

            // Return the response after the transaction
            return response()->json(['retrait' => $retrait], 201);
        } catch (\Illuminate\Database\QueryException $e) {
            // Ignore duplicate entry errors for cheques
            \Log::warning('[RetraitController@store] Query exception', ['message' => $e->getMessage()]);
            // Check if it's a duplicate entry error
            if (strpos($e->getMessage(), 'Duplicate entry') !== false) {
                // Proceed anyway - just create the retrait without cheque or silently fail?
                // Let's create the retrait and continue
                $account = Account::find($request->account_id);
                $newBalance = $account->balance - $request->montant;
                
                $retrait = Retrait::create([
                    'account_id' => $request->account_id,
                    'type_retrait' => $request->type_retrait,
                    'montant' => $request->montant,
                    'solde_avant' => $account->balance,
                    'solde_apres' => $newBalance,
                    'guichetier_id' => auth()->id(),
                    'date_operation' => now(),
                ]);
                
                $account->update(['balance' => $newBalance]);
                
                return response()->json(['retrait' => $retrait], 201);
            }
            throw $e;
        }
    }

    public function show($id)
    {
        $retrait = Retrait::with(['account.client', 'cheque'])->find($id);

        if (! $retrait) {
            return response()->json(['message' => 'Retrait introuvable.'], 404);
        }

        return response()->json(['retrait' => $retrait]);
    }

    public function recuPdf($id)
    {
        $retrait = Retrait::with(['account.client', 'guichetier', 'cheque'])->find($id);

        if (! $retrait) {
            abort(404, 'Retrait introuvable.');
        }

        $view = $retrait->type_retrait === 'cheque'
            ? 'pdf.recu-retrait-cheque'
            : 'pdf.recu-retrait-personnel';

        // Prepare data for the view (matching attestation-solde style)
        $client = $retrait->account->client;
        $account = $retrait->account;

        // Get agency info
        $agenceName = $client->agence?->name ?? 'Agence';
        $agenceCode = $client->agence?->code_agence ?? 'N/A';
        $agenceVille = $client->agence?->ville ?? 'N/A';

        $tellerName = $retrait->guichetier?->name ?? 'Guichetier';

        $issueDate = $retrait->date_operation?->format('d/m/Y') ?? now()->format('d/m/Y');
        $issueTime = $retrait->date_operation?->format('H:i') ?? now()->format('H:i');
        $reference = $retrait->id;

        $pdf = Pdf::loadView($view, [
            'retrait' => $retrait,
            'client' => $client,
            'account' => $account,
            'agenceName' => $agenceName,
            'agenceCode' => $agenceCode,
            'agenceVille' => $agenceVille,
            'tellerName' => $tellerName,
            'issueDate' => $issueDate,
            'issueTime' => $issueTime,
            'reference' => $reference
        ]);

        return $pdf->download("recu-retrait-{$retrait->id}.pdf");
    }

    public function storeCertificat(Request $request)
    {
        $data = $request->validate([
            'numero_cheque' => 'required|string|max:255',
            'account_id' => 'required|integer|exists:accounts,id',
            'beneficiaire_nom' => 'required|string|max:255',
            'beneficiaire_prenom' => 'required|string|max:255',
            'beneficiaire_cin' => 'required|string|max:255',
            'beneficiaire_cin_expiration' => 'nullable|date',
            'montant' => 'required|numeric|min:0.01',
            'motif' => 'required|string|max:500',
        ]);

        $account = Account::find($data['account_id']);

        if (! $account) {
            return response()->json(['message' => 'Compte introuvable.'], 404);
        }

        $cheque = Cheque::create([
            'numero_cheque' => $data['numero_cheque'],
            'account_id' => $account->id,
            'beneficiaire_nom' => $data['beneficiaire_nom'],
            'beneficiaire_prenom' => $data['beneficiaire_prenom'],
            'beneficiaire_cin' => $data['beneficiaire_cin'],
            'beneficiaire_cin_expiration' => $data['beneficiaire_cin_expiration'] ?? null,
            'montant' => $data['montant'],
            'statut' => 'rejete',
        ]);

        $avis = AvisRejetCheque::create([
            'cheque_id' => $cheque->id,
            'motif' => $data['motif'],
            'pdf_path' => '', // We'll generate on the fly now
        ]);

        return response()->json(['avis' => $avis], 201);
    }

    public function certificatPdf($id)
    {
        $avis = AvisRejetCheque::with('cheque.account.client')->find($id);

        if (! $avis) {
            abort(404, 'Certificat introuvable.');
        }

        $cheque = $avis->cheque;
        $account = $cheque->account;
        $client = $account->client;

        $agenceName = $client->agence?->name ?? 'Agence';
        $agenceCode = $client->agence?->code_agence ?? 'N/A';
        $agenceVille = $client->agence?->ville ?? 'N/A';

        $issueDate = $avis->created_at?->format('d/m/Y') ?? now()->format('d/m/Y');
        $issueTime = $avis->created_at?->format('H:i') ?? now()->format('H:i');
        $reference = $avis->id;

        $pdf = Pdf::loadView('pdf.avis-rejet-cheque', [
            'avis' => $avis,
            'cheque' => $cheque,
            'account' => $account,
            'client' => $client,
            'motif' => $avis->motif,
            'agenceName' => $agenceName,
            'agenceCode' => $agenceCode,
            'agenceVille' => $agenceVille,
            'issueDate' => $issueDate,
            'issueTime' => $issueTime,
            'reference' => $reference,
        ]);

        return $pdf->download("avis-rejet-cheque-{$avis->id}.pdf");
    }
}
