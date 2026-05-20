<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    /**
     * Login
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();
        $isGuichetier = false;

        if (!$user) {
            $user = \App\Models\Guichetier::where('email', $request->email)->first();
            $isGuichetier = $user ? true : false;
        }

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Identifiants incorrects.',
            ], 401);
        }

        // Check if account is active
        if (!$user->is_active) {
            return response()->json([
                'message' => 'Votre compte a été désactivé. Contactez l\'administrateur.',
            ], 403);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        ActivityLog::log('login', "Connexion de l'utilisateur " . ($isGuichetier ? $user->nom . ' ' . $user->prenom : $user->name), $user);

        return response()->json([
            'message' => 'Connexion réussie.',
            'user' => [
                'id' => $user->id,
                'name' => $isGuichetier ? $user->nom . ' ' . $user->prenom : $user->name,
                'email' => $user->email,
                'role' => $isGuichetier ? 'guichetier' : $user->role,
                'must_change_password' => $user->must_change_password,
                'agency_name' => $isGuichetier ? ($user->agence->nom ?? null) : $user->agency_name,
                'agency_code' => $isGuichetier ? ($user->agence->code_agence ?? null) : $user->agency_code,
            ],
            'token' => $token,
        ]);
    }

    /**
     * Logout
     */
    public function logout(Request $request)
    {
        ActivityLog::log('logout', "Déconnexion de l'utilisateur {$request->user()->name}", $request->user());
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Déconnexion réussie.',
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user();
        $isGuichetier = $user instanceof \App\Models\Guichetier;

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $isGuichetier ? $user->nom . ' ' . $user->prenom : $user->name,
                'email' => $user->email,
                'role' => $isGuichetier ? 'guichetier' : $user->role,
                'must_change_password' => $user->must_change_password,
                'is_active' => $isGuichetier ? true : $user->is_active,
                'phone' => $isGuichetier ? null : $user->phone,
                'address' => $isGuichetier ? null : $user->address,
                'agency_name' => $isGuichetier ? ($user->agence->nom ?? null) : $user->agency_name,
                'agency_code' => $isGuichetier ? ($user->agence->code_agence ?? null) : $user->agency_code,
                'agence_id' => $isGuichetier ? $user->agence_id : null,
            ],
        ]);
    }

    /**
     * Get user profile details
     */
    public function profile(Request $request)
    {
        $user = $request->user();
        $isGuichetier = $user instanceof \App\Models\Guichetier;

        $userInfo = [
            'nom' => $isGuichetier ? $user->nom : explode(' ', $user->name)[0],
            'prenom' => $isGuichetier ? $user->prenom : (count(explode(' ', $user->name)) > 1 ? explode(' ', $user->name)[1] : ''),
            'email' => $user->email,
            'phone' => $isGuichetier ? null : $user->phone,
            'role' => $isGuichetier ? 'guichetier' : $user->role,
            'photo' => null // Upload photo functionality to be handled in the future
        ];

        $agenceInfo = [
            'nom' => $isGuichetier ? ($user->agence->nom ?? '') : $user->agency_name,
            'ville' => $isGuichetier ? ($user->agence->ville ?? '') : ($user->address ?? ''),
            'code_agence' => $isGuichetier ? ($user->agence->code_agence ?? '') : $user->agency_code,
            'adresse' => $isGuichetier ? ($user->agence->adresse ?? '') : $user->address,
        ];

        return response()->json([
            'user' => $userInfo,
            'agence' => $agenceInfo
        ]);
    }

    /**
     * Change password (first login or voluntary)
     */
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'new_password' => ['required', 'string', 'confirmed', Password::min(8)->mixedCase()->numbers()],
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Le mot de passe actuel est incorrect.',
            ], 422);
        }

        $user->update([
            'password' => Hash::make($request->new_password),
            'must_change_password' => false,
        ]);

        $userName = $user instanceof \App\Models\Guichetier ? ($user->nom . ' ' . $user->prenom) : $user->name;
        ActivityLog::log('password_change', "Changement de mot de passe pour {$userName}", $user);

        return response()->json([
            'message' => 'Mot de passe modifié avec succès.',
        ]);
    }
}
