<?php

namespace App\Http\Controllers;

use App\Models\Guichetier;
use App\Models\Agence;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class GuichetierController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $guichetiers = Guichetier::with('agence')->orderBy('created_at', 'desc')->get();
        // Also fetch agences for the frontend dropdown
        $agences = Agence::all();

        return response()->json([
            'success' => true,
            'guichetiers' => $guichetiers,
            'agences' => $agences
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'cin' => 'required|string|max:20|unique:guichetiers,cin',
            'agence_id' => 'required|exists:agences,id',
            'email' => 'required|email|unique:guichetiers,email',
            'password' => 'required|string|min:8|regex:/[a-z]/|regex:/[A-Z]/|regex:/[0-9]/',
        ], [
            'nom.required' => 'Le nom est obligatoire.',
            'prenom.required' => 'Le prénom est obligatoire.',
            'cin.required' => 'La CIN est obligatoire.',
            'cin.unique' => 'Cette CIN existe déjà.',
            'agence_id.required' => 'L\'agence est obligatoire.',
            'agence_id.exists' => 'L\'agence sélectionnée n\'existe pas.',
            'email.required' => 'L\'email est obligatoire.',
            'email.email' => 'L\'email n\'est pas valide.',
            'email.unique' => 'Cet email existe déjà.',
            'password.required' => 'Le mot de passe est obligatoire.',
            'password.min' => 'Le mot de passe doit contenir au moins 8 caractères.',
            'password.regex' => 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation des données.',
                'errors' => $validator->errors()
            ], 422);
        }

        // Generate numero_guichetier
        $lastGuichetier = Guichetier::orderBy('numero_guichetier', 'desc')->first();
        $numero_guichetier = $lastGuichetier ? $lastGuichetier->numero_guichetier + 1 : 5001;

        $guichetier = Guichetier::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'cin' => $request->cin,
            'agence_id' => $request->agence_id,
            'numero_guichetier' => $numero_guichetier,
            'email' => $request->email,
            'password' => $request->password, // Model will hash it
            'must_change_password' => true,
            'is_active' => true
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Guichetier ajouté avec succès.',
            'guichetier' => $guichetier->load('agence')
        ], 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $guichetier = Guichetier::find($id);

        if (!$guichetier) {
            return response()->json([
                'success' => false,
                'message' => 'Guichetier introuvable.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'cin' => 'required|string|max:20|unique:guichetiers,cin,' . $id,
            'agence_id' => 'required|exists:agences,id',
            'email' => 'required|email|unique:guichetiers,email,' . $id,
            'is_active' => 'required|boolean',
            'password' => 'nullable|string|min:8|regex:/[a-z]/|regex:/[A-Z]/|regex:/[0-9]/',
        ], [
            'nom.required' => 'Le nom est obligatoire.',
            'prenom.required' => 'Le prénom est obligatoire.',
            'cin.required' => 'La CIN est obligatoire.',
            'cin.unique' => 'Cette CIN est déjà utilisée.',
            'agence_id.required' => 'L\'agence est obligatoire.',
            'email.unique' => 'Cet email est déjà utilisé.',
            'password.min' => 'Le nouveau mot de passe doit contenir au moins 8 caractères.',
            'password.regex' => 'Le nouveau mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation.',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->only(['nom', 'prenom', 'cin', 'agence_id', 'email', 'is_active']);
        
        // Only update password and force change if a NEW password is provided
        if ($request->has('password') && !empty($request->password)) {
            $data['password'] = $request->password;
            $data['must_change_password'] = true;
        }

        $guichetier->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Guichetier mis à jour avec succès.',
            'guichetier' => $guichetier->load('agence')
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $guichetier = Guichetier::find($id);

        if (!$guichetier) {
            return response()->json([
                'success' => false,
                'message' => 'Guichetier introuvable.'
            ], 404);
        }

        $guichetier->delete();

        return response()->json([
            'success' => true,
            'message' => 'Guichetier supprimé avec succès.'
        ]);
    }

    public function getVilles()
    {
        $villes = Agence::select('ville')->distinct()->orderBy('ville')->pluck('ville');
        
        $lastGuichetier = Guichetier::orderBy('numero_guichetier', 'desc')->first();
        $nextMatricule = $lastGuichetier ? $lastGuichetier->numero_guichetier + 1 : 5001;

        return response()->json([
            'villes' => $villes,
            'next_matricule' => $nextMatricule
        ]);
    }

    /**
     * Get agences filtered by city
     */
    public function getAgencesByVille($ville)
    {
        $agences = Agence::where('ville', $ville)->orderBy('nom')->get();
        return response()->json($agences);
    }
}
