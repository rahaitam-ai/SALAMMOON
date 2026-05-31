<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Account;
use App\Models\Client;
use App\Models\Depot;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DepotController extends Controller
{
    /**
     * Vérifier un compte par RIB ou numéro de compte
     * POST /api/accounts/verify
     */
    public function verifyAccount(Request $request)
    {
        $request->validate([
            'identifier' => 'required|string',
        ]);

        $identifier = $request->identifier;

        $account = Account::with('client')
            ->where('rib', $identifier)
            ->orWhere('numero_compte', $identifier)
            ->first();

        if (!$account) {
            return response()->json([
                'exists' => false,
                'message' => 'Aucun compte trouvé avec ce RIB ou numéro de compte.',
            ], 404);
        }

        // Vérifier que le compte appartient à l'agence de l'utilisateur
        $user = auth()->user();
        $agenceId = $this->getUserAgenceId($user);

        if ($agenceId && $account->client && $account->client->agence_id !== $agenceId) {
            return response()->json([
                'exists' => false,
                'message' => 'Ce compte n\'appartient pas à votre agence.',
            ], 403);
        }

        return response()->json([
            'exists' => true,
            'account' => [
                'id' => $account->id,
                'numero_compte' => $account->numero_compte,
                'rib' => $account->rib,
                'balance' => (float) $account->balance,
                'status' => $account->is_active ? 'active' : 'bloqué',
                'client_name' => $account->client
                    ? ($account->client->nom . ' ' . $account->client->prenom)
                    : 'N/A',
                'client_id' => $account->client_id,
                'type_name' => $account->type->name ?? 'Compte Bancaire',
            ],
        ]);
    }

    /**
     * Recherche de compte par RIB/numéro (GET /api/comptes/recherche)
     */
    public function rechercheCompte(Request $request)
    {
        $request->validate([
            'q' => 'required|string',
        ]);

        $account = Account::with('client')
            ->where('rib', $request->q)
            ->orWhere('numero_compte', $request->q)
            ->first();

        if (!$account) {
            return response()->json([
                'found' => false,
                'message' => 'Compte introuvable.',
            ], 404);
        }

        $user = auth()->user();
        $agenceId = $this->getUserAgenceId($user);

        if ($agenceId && $account->client && $account->client->agence_id !== $agenceId) {
            return response()->json([
                'found' => false,
                'message' => 'Ce compte n\'appartient pas à votre agence.',
            ], 403);
        }

        return response()->json([
            'found' => true,
            'account' => [
                'id' => $account->id,
                'numero_compte' => $account->numero_compte,
                'rib' => $account->rib,
                'balance' => (float) $account->balance,
                'is_active' => $account->is_active,
                'client' => $account->client ? [
                    'id' => $account->client->id,
                    'nom' => $account->client->nom,
                    'prenom' => $account->client->prenom,
                    'cin' => $account->client->cin,
                ] : null,
                'type' => $account->type ? ['name' => $account->type->name] : null,
            ],
        ]);
    }

    /**
     * Lister les dépôts
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $agenceId = $this->getUserAgenceId($user);

        $query = Depot::with('creator')->latest();

        // Filtrer par agence
        if ($agenceId) {
            $query->whereHas('account.client', function ($q) use ($agenceId) {
                $q->where('agence_id', $agenceId);
            });
        }

        if ($request->has('account_id')) {
            $query->where('account_id', $request->account_id);
        }

        $depots = $query->paginate(20);

        return response()->json([
            'depots' => $depots,
        ]);
    }

    public function getByAccount($accountId)
    {
        $depots = Depot::where('account_id', $accountId)->latest()->get();
        return response()->json(['depots' => $depots]);
    }

    /**
     * Enregistrer un dépôt (POST /api/depots)
     */
    public function store(Request $request)
    {
        $request->validate([
            'account_id' => 'required|exists:accounts,id',
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'cin' => 'required|string|max:50',
            'adresse' => 'nullable|string|max:500',
            'date_depot' => 'nullable|date',
            'date_expiration_cin' => 'nullable|date',
            'montant' => 'required|numeric|min:0.01',
            'type_depot' => 'nullable|in:especes,cheque',
            'nom_cheque' => 'nullable|string|max:255',
            'prenom_cheque' => 'nullable|string|max:255',
            'numero_serie_cheque' => 'nullable|string|max:100',
            'date_cheque' => 'nullable|date',
        ]);

        $account = Account::with('client')->findOrFail($request->account_id);

        // Vérifier que le compte est actif
        if (!$account->is_active) {
            return response()->json([
                'message' => 'Ce compte est bloqué. Impossible d\'effectuer un dépôt.',
            ], 400);
        }

        // Vérifier l'appartenance à l'agence
        $user = auth()->user();
        $agenceId = $this->getUserAgenceId($user);
        if ($agenceId && $account->client && $account->client->agence_id !== $agenceId) {
            return response()->json([
                'message' => 'Ce compte n\'appartient pas à votre agence.',
            ], 403);
        }

        try {
            DB::beginTransaction();

            // Générer une référence unique
            $reference = 'DEP-' . date('Ymd') . '-' . strtoupper(Str::random(8));
            while (Depot::where('reference_operation', $reference)->exists()) {
                $reference = 'DEP-' . date('Ymd') . '-' . strtoupper(Str::random(8));
            }

            $ancienSolde = (float) $account->balance;
            $montant = (float) $request->montant;
            $nouveauSolde = $ancienSolde + $montant;

            // Créer le dépôt
            $depot = Depot::create([
                'reference_operation' => $reference,
                'account_id' => $account->id,
                'numero_compte' => $account->numero_compte,
                'rib' => $account->rib,
                'nom' => $request->nom,
                'prenom' => $request->prenom,
                'cin' => $request->cin,
                'adresse' => $request->adresse ?? ($account->client->adresse ?? null),
                'date_depot' => $request->date_depot ?? now()->toDateString(),
                'heure_depot' => now()->toTimeString(),
                'date_expiration_cin' => $request->date_expiration_cin,
                'montant' => $montant,
                'ancien_solde' => $ancienSolde,
                'nouveau_solde' => $nouveauSolde,
                'type_depot' => $request->type_depot ?? 'especes',
                'nom_cheque' => $request->nom_cheque,
                'prenom_cheque' => $request->prenom_cheque,
                'numero_serie_cheque' => $request->numero_serie_cheque,
                'date_cheque' => $request->date_cheque,
                'created_by' => auth()->id(),
            ]);

            // Mettre à jour le solde du compte
            $account->balance = $nouveauSolde;
            $account->save();

            // Audit trail
            ActivityLog::log(
                'depot',
                "Dépôt de " . number_format($montant, 2) . " MAD sur le compte {$account->numero_compte} - Réf: {$reference}",
                $depot,
                ['ancien_solde' => $ancienSolde],
                ['nouveau_solde' => $nouveauSolde, 'montant' => $montant]
            );

            DB::commit();

            return response()->json([
                'message' => 'Dépôt enregistré avec succès.',
                'depot' => $depot,
                'nouveau_solde' => $nouveauSolde,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erreur lors de l\'enregistrement du dépôt: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Afficher un dépôt (GET /api/depots/{id})
     */
    public function show($id)
    {
        $depot = Depot::with(['account.client', 'creator'])->findOrFail($id);

        $user = auth()->user();
        $agenceId = $this->getUserAgenceId($user);
        if ($agenceId && $depot->account->client && $depot->account->client->agence_id !== $agenceId) {
            return response()->json(['message' => 'Accès non autorisé.'], 403);
        }

        return response()->json([
            'depot' => $depot,
        ]);
    }

    /**
     * Générer le PDF du reçu de dépôt (GET /api/depots/{id}/recu)
     */
    public function recuPdf($id)
    {
        $depot = Depot::with(['account.client', 'creator'])->findOrFail($id);
        $account = $depot->account;
        $client = $account->client;

        $date_depot = \Carbon\Carbon::parse($depot->created_at)->format('d/m/Y');
        $heure_depot = \Carbon\Carbon::parse($depot->created_at)->format('H:i');
        $tellerName = $depot->creator
            ? ($depot->creator->prenom . ' ' . $depot->creator->nom)
            : 'Guichetier Agence';

        $data = compact('depot', 'account', 'client', 'date_depot', 'heure_depot', 'tellerName');

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.recu-depot', $data);
        $pdf->setPaper('A4', 'portrait');

        return $pdf->download("recu-depot-{$depot->reference_operation}.pdf");
    }

    /**
     * Helper: get the agence_id for the authenticated user
     */
    private function getUserAgenceId($user)
    {
        if ($user instanceof \App\Models\Guichetier) {
            return $user->agence_id;
        }

        if ($user->role === 'agence') {
            $agence = \App\Models\Agence::where('code_agence', $user->agency_code)->first();
            return $agence ? $agence->id : null;
        }

        return null;
    }
}
