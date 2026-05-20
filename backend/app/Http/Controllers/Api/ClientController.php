<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Agence;
use App\Services\ClientNumberService;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    protected $clientNumberService;

    public function __construct(ClientNumberService $clientNumberService)
    {
        $this->clientNumberService = $clientNumberService;
    }
    public function index()
    {
        return response()->json([
            'clients' => Client::with('agence')->latest()->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'civilite' => 'required|string|in:Monsieur,Madame',
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'cin' => 'required|string|unique:clients,cin',
            'phone' => 'required|string',
            'email' => 'nullable|email',
            'adresse' => 'nullable|string',
            'date_naissance' => 'nullable|date',
            'nationalite' => 'required|string',
            'profession' => 'nullable|string',
            'agence_id' => 'required_if:role,siege|exists:agences,id',
        ]);

        $user = auth()->user();
        $agence_id = $request->agence_id;
        $agence_code = '';
        
        if ($user instanceof \App\Models\Guichetier) {
            $agence_id = $user->agence_id;
            $agence_code = $user->agence->code_agence ?? 'ABB';
        } elseif ($user->role === 'agence') {
            $agence = Agence::where('code_agence', $user->agency_code)->first();
            $agence_id = $agence ? $agence->id : null;
            $agence_code = $user->agency_code;
        } elseif ($agence_id) {
            $agence = Agence::find($agence_id);
            $agence_code = $agence ? $agence->code_agence : 'ABB';
        }

        // Generate client number if not provided (should be generated on backend for safety)
        $client_number = $this->clientNumberService->generate($agence_code, $agence_id);

        $client = Client::create([
            ...$request->all(),
            'client_number' => $client_number,
            'agence_id' => $agence_id,
            'created_by' => auth()->id(),
        ]);

        return response()->json([
            'message' => 'Client créé avec succès',
            'client' => $client
        ]);
    }

    public function show($id)
    {
        return response()->json(Client::with(['accounts.type', 'accounts.pack', 'creator'])->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $client = Client::findOrFail($id);
        $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'cin' => 'required|string|unique:clients,cin,'.$id,
            'phone' => 'required|string',
        ]);

        $client->update($request->all());

        return response()->json([
            'message' => 'Client mis à jour avec succès',
            'client' => $client
        ]);
    }

    public function destroy($id)
    {
        $client = Client::findOrFail($id);
        $client->delete();
        return response()->json(['message' => 'Client supprimé avec succès']);
    }
    public function getNextNumber(Request $request)
    {
        $user = auth()->user();
        $agence_id = $request->agence_id;
        $agence_code = '';

        if ($user instanceof \App\Models\Guichetier) {
            $agence_id = $user->agence_id;
            $agence_code = $user->agence->code_agence ?? 'ABB';
        } elseif ($user->role === 'agence') {
            $agence = Agence::where('code_agence', $user->agency_code)->first();
            $agence_id = $agence ? $agence->id : null;
            $agence_code = $user->agency_code;
        } elseif ($agence_id) {
            $agence = Agence::find($agence_id);
            $agence_code = $agence ? $agence->code_agence : 'ABB';
        }

        if (!$agence_id) {
            return response()->json(['error' => 'Agence non identifiée'], 400);
        }

        return response()->json([
            'client_number' => $this->clientNumberService->generate($agence_code, $agence_id)
        ]);
    }
}
