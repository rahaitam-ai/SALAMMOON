<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Account;
use App\Models\Client;
use App\Models\AccountType;
use App\Models\Pack;
use App\Models\Product;
use App\Models\Agence;
use App\Services\AccountNumberService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AccountController extends Controller
{
    protected $accountNumberService;

    public function __construct(AccountNumberService $accountNumberService)
    {
        $this->accountNumberService = $accountNumberService;
    }
    public function index(Request $request)
    {
        $user = auth()->user();
        $query = Account::with(['client', 'type', 'pack', 'products']);

        // Filter by Agency
        if ($user instanceof \App\Models\Guichetier) {
            $query->whereHas('client', function($q) use ($user) {
                $q->where('agence_id', $user->agence_id);
            });
        } elseif ($user->role === 'agence') {
            $agence = \App\Models\Agence::where('code_agence', $user->agency_code)->first();
            if ($agence) {
                $query->whereHas('client', function($q) use ($agence) {
                    $q->where('agence_id', $agence->id);
                });
            }
        }

        if ($request->has('search')) {
            $search = $request->search;
            $mode = $request->get('search_mode', 'all');
            
            $query->where(function($mainQ) use ($search, $mode) {
                if ($mode === 'name') {
                    $mainQ->whereHas('client', function($q) use ($search) {
                        $q->where('nom', 'like', "%$search%")
                          ->orWhere('prenom', 'like', "%$search%");
                    });
                } elseif ($mode === 'cin') {
                    $mainQ->whereHas('client', function($q) use ($search) {
                        $q->where('cin', 'like', "%$search%");
                    });
                } elseif ($mode === 'client_number') {
                    $mainQ->whereHas('client', function($q) use ($search) {
                        $q->where('client_number', 'like', "%$search%");
                    });
                } elseif ($mode === 'account_number') {
                    $mainQ->where('numero_compte', 'like', "%$search%");
                } else {
                    $mainQ->whereHas('client', function($q) use ($search) {
                        $q->where('nom', 'like', "%$search%")
                          ->orWhere('prenom', 'like', "%$search%")
                          ->orWhere('cin', 'like', "%$search%")
                          ->orWhere('client_number', 'like', "%$search%");
                    })->orWhere('numero_compte', 'like', "%$search%");
                }
            });
        }

        if ($request->has('type_id') && !empty($request->type_id)) {
            $query->where('account_type_id', $request->type_id);
        }

        if ($request->has('pack_id') && !empty($request->pack_id)) {
            $query->where('pack_id', $request->pack_id);
        }

        return response()->json([
            'accounts' => $query->latest()->get()
        ]);
    }

    public function getFormData()
    {
        $user = auth()->user();
        $agence_id = null;

        if ($user instanceof \App\Models\Guichetier) {
            $agence_id = $user->agence_id;
        } elseif ($user->role === 'agence') {
            $agence = \App\Models\Agence::where('code_agence', $user->agency_code)->first();
            $agence_id = $agence ? $agence->id : null;
        }

        return response()->json([
            'clients' => $agence_id 
                ? Client::with('creator')->where('agence_id', $agence_id)->get() 
                : Client::with('creator')->all(),
            'account_types' => AccountType::where('is_active', true)->get(),
            'packs' => Pack::with('products')->where('is_active', true)->get(),
            'products' => Product::where('is_active', true)->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'client_id' => 'required|exists:clients,id',
            'account_type_id' => 'required|exists:account_types,id',
            'initial_balance' => 'required|numeric|min:0',
            'pack_id' => 'nullable|exists:packs,id',
            'product_ids' => 'nullable|array',
            'product_ids.*' => 'exists:products,id',
        ]);

        try {
            DB::beginTransaction();

            $user = auth()->user();
            $agence_id = null;
            $agence_code = '';

            if ($user instanceof \App\Models\Guichetier) {
                $agence_id = $user->agence_id;
                $agence_code = $user->agence->code_agence ?? 'ABB';
            } elseif ($user->role === 'agence') {
                $agence = Agence::where('code_agence', $user->agency_code)->first();
                $agence_id = $agence ? $agence->id : null;
                $agence_code = $user->agency_code;
            }

            // If we still don't have agence_id, we try to get it from the client
            if (!$agence_id && $request->client_id) {
                $client = Client::find($request->client_id);
                $agence_id = $client ? $client->agence_id : null;
                $agence_code = $client && $client->agence ? $client->agence->code_agence : 'ABB';
            }

            $numero_compte = $this->accountNumberService->generate($agence_code, $agence_id);

            // Generate unique RIB (numero_compte + 9 random digits)
            $rib = '';
            do {
                $randomDigits = '';
                for ($i = 0; $i < 9; $i++) {
                    $randomDigits .= rand(0, 9);
                }
                $rib = $numero_compte . $randomDigits;
            } while (Account::where('rib', $rib)->exists());

            $account = Account::create([
                'numero_compte' => $numero_compte,
                'rib' => $rib,
                'balance' => $request->initial_balance,
                'client_id' => $request->client_id,
                'account_type_id' => $request->account_type_id,
                'pack_id' => $request->pack_id,
                'is_active' => true,
                'created_by' => auth()->id(),
            ]);

            // Associate products from pack if any
            $all_product_ids = [];
            if ($request->pack_id) {
                $pack = Pack::with('products')->find($request->pack_id);
                $all_product_ids = $pack->products->pluck('id')->toArray();
            }

            // Merge with extra products
            if ($request->product_ids) {
                $all_product_ids = array_unique(array_merge($all_product_ids, $request->product_ids));
            }

            if (!empty($all_product_ids)) {
                $account->products()->attach($all_product_ids);
            }

            DB::commit();

            return response()->json([
                'message' => 'Compte bancaire créé avec succès',
                'account' => $account->load(['client', 'type', 'pack', 'products'])
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Erreur lors de la création du compte: ' . $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        $account = Account::with(['client.agence', 'type', 'pack', 'products'])->findOrFail($id);
        return response()->json([
            'account' => $account
        ]);
    }

    public function destroy($id)
    {
        $account = Account::findOrFail($id);
        $account->delete();
        return response()->json(['message' => 'Compte supprimé avec succès']);
    }

    public function getNextNumber(Request $request)
    {
        $user = auth()->user();
        $agence_id = null;
        $agence_code = '';

        if ($user instanceof \App\Models\Guichetier) {
            $agence_id = $user->agence_id;
            $agence_code = $user->agence->code_agence ?? 'ABB';
        } elseif ($user->role === 'agence') {
            $agence = Agence::where('code_agence', $user->agency_code)->first();
            $agence_id = $agence ? $agence->id : null;
            $agence_code = $user->agency_code;
        }

        if (!$agence_id) {
            return response()->json(['error' => 'Agence non identifiée'], 400);
        }

        return response()->json([
            'numero_compte' => $this->accountNumberService->generate($agence_code, $agence_id)
        ]);
    }

    public function generatePdf($id)
    {
        $account = Account::with(['client.agence', 'type', 'pack', 'products'])->findOrFail($id);

        $client = $account->client;
        $creationDate = \Carbon\Carbon::parse($account->created_at)->format('d/m/Y');
        $agenceName = $client && $client->agence ? $client->agence->nom : 'Al Barid Bank';
        $agenceCode = $client && $client->agence ? $client->agence->code_agence : 'ABB';
        $agenceVille = $client && $client->agence ? ($client->agence->ville ?? 'Maroc') : 'Maroc';

        $data = compact('account', 'client', 'creationDate', 'agenceName', 'agenceCode', 'agenceVille');

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.recu-ouverture', $data);
        $pdf->setPaper('A4', 'portrait');

        return $pdf->download("Recu_Ouverture_" . $client->cin . ".pdf");
    }

    public function generateRibPdf($id)
    {
        $account = Account::with(['client.agence', 'type', 'pack', 'products'])->findOrFail($id);

        $client = $account->client;
        $creationDate = \Carbon\Carbon::parse($account->created_at)->format('d/m/Y');
        $agenceName = $client && $client->agence ? $client->agence->nom : 'Al Barid Bank';
        $agenceCode = $client && $client->agence ? $client->agence->code_agence : 'ABB';
        $agenceVille = $client && $client->agence ? ($client->agence->ville ?? 'Maroc') : 'Maroc';

        $data = compact('account', 'client', 'creationDate', 'agenceName', 'agenceCode', 'agenceVille');

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.rib', $data);
        $pdf->setPaper('A4', 'portrait');

        return $pdf->download("RIB_" . $client->cin . ".pdf");
    }
}
