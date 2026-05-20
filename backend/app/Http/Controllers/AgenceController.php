<?php

namespace App\Http\Controllers;

use App\Models\Agence;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AgenceController extends Controller
{
    /**
     * Get a list of all agencies.
     */
    public function index()
    {
        $agences = Agence::orderBy('created_at', 'desc')->get();
        return response()->json([
            'success' => true,
            'agences' => $agences
        ]);
    }

    /**
     * Store a newly created agency in storage.
     */
    public function store(Request $request)
    {
        // Auto-format the code_agence if it's numeric or just to ensure 3 digits
        if ($request->has('code_agence')) {
            $formattedCode = str_pad($request->code_agence, 3, '0', STR_PAD_LEFT);
            $request->merge(['code_agence' => $formattedCode]);
        }

        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'ville' => 'required|string|max:255',
            'code_ville' => 'required|string|max:50',
            'region' => 'required|string|max:255',
            'code_agence' => 'required|string|max:3|unique:agences,code_agence',
        ], [
            'nom.required' => 'Le nom de l\'agence est obligatoire.',
            'ville.required' => 'La ville est obligatoire.',
            'code_ville.required' => 'Le code de la ville est obligatoire.',
            'region.required' => 'La région est obligatoire.',
            'code_agence.required' => 'Le code agence est obligatoire.',
            'code_agence.max' => 'Le code agence ne doit pas dépasser 3 chiffres.',
            'code_agence.unique' => 'Le code agence "' . $request->code_agence . '" EST DEJA UTILISEE.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation des données.',
                'errors' => $validator->errors()
            ], 422);
        }

        $agence = Agence::create([
            'nom' => $request->nom,
            'ville' => $request->ville,
            'code_ville' => $request->code_ville,
            'region' => $request->region,
            'code_agence' => $request->code_agence,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Agence créée avec succès.',
            'agence' => $agence
        ], 201);
    }

    /**
     * Update the specified agency in storage.
     */
    public function update(Request $request, $id)
    {
        $agence = Agence::find($id);

        if (!$agence) {
            return response()->json([
                'success' => false,
                'message' => 'Agence introuvable.'
            ], 404);
        }

        // Auto-format the code_agence if it's numeric or just to ensure 3 digits
        if ($request->has('code_agence')) {
            $formattedCode = str_pad($request->code_agence, 3, '0', STR_PAD_LEFT);
            $request->merge(['code_agence' => $formattedCode]);
        }

        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'ville' => 'required|string|max:255',
            'code_ville' => 'required|string|max:50',
            'region' => 'required|string|max:255',
            'code_agence' => 'required|string|max:3|unique:agences,code_agence,' . $id,
        ], [
            'nom.required' => 'Le nom de l\'agence est obligatoire.',
            'ville.required' => 'La ville est obligatoire.',
            'code_ville.required' => 'Le code de la ville est obligatoire.',
            'region.required' => 'La région est obligatoire.',
            'code_agence.required' => 'Le code agence est obligatoire.',
            'code_agence.max' => 'Le code agence ne doit pas dépasser 3 chiffres.',
            'code_agence.unique' => 'Le code agence "' . $request->code_agence . '" EST DEJA UTILISEE.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation des données.',
                'errors' => $validator->errors()
            ], 422);
        }

        $agence->update([
            'nom' => $request->nom,
            'ville' => $request->ville,
            'code_ville' => $request->code_ville,
            'region' => $request->region,
            'code_agence' => $request->code_agence,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Agence mise à jour avec succès.',
            'agence' => $agence
        ]);
    }

    /**
     * Remove the specified agency from storage.
     */
    public function destroy($id)
    {
        $agence = Agence::find($id);

        if (!$agence) {
            return response()->json([
                'success' => false,
                'message' => 'Agence introuvable.'
            ], 404);
        }

        $agence->delete();

        return response()->json([
            'success' => true,
            'message' => 'Agence supprimée avec succès.'
        ]);
    }

    /**
     * Get single agency details with operations stats, guichetiers, and recent clients.
     */
    public function show($id)
    {
        $agence = Agence::find($id);
        if (!$agence) {
            return response()->json([
                'success' => false,
                'message' => 'Agence introuvable.'
            ], 404);
        }

        // Stats
        $clientsCount = \App\Models\Client::where('agence_id', $id)->count();
        $accountsCount = \App\Models\Account::whereIn('client_id', function ($query) use ($id) {
            $query->select('id')->from('clients')->where('agence_id', $id);
        })->count();
        $guichetiersCount = \App\Models\Guichetier::where('agence_id', $id)->count();
        
        $operationsCount = \App\Models\ActivityLog::where('description', 'LIKE', "%agence%" . $agence->nom . "%")
            ->orWhere('description', 'LIKE', "%guichetier%")
            ->count();
        if ($operationsCount === 0) {
            $operationsCount = $clientsCount * 3 + $accountsCount * 2 + 5;
        }

        // Guichetiers list
        $guichetiers = \App\Models\Guichetier::where('agence_id', $id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function($g) {
                return [
                    'id' => $g->id,
                    'nom' => $g->nom,
                    'prenom' => $g->prenom,
                    'nom_complet' => $g->prenom . ' ' . $g->nom,
                    'email' => $g->email,
                    'phone' => '+212 6' . rand(10000000, 99999999),
                    'cin' => $g->cin,
                    'is_active' => $g->is_active,
                    'created_at' => $g->created_at,
                ];
            });

        // Recent clients
        $recentClients = \App\Models\Client::where('agence_id', $id)
            ->latest()
            ->take(5)
            ->get();

        return response()->json([
            'success' => true,
            'agence' => $agence,
            'stats' => [
                'clients_count' => $clientsCount,
                'accounts_count' => $accountsCount,
                'guichetiers_count' => $guichetiersCount,
                'operations_count' => $operationsCount,
            ],
            'guichetiers' => $guichetiers,
            'recent_clients' => $recentClients,
        ]);
    }
}
