<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    /**
     * Dashboard stats
     */
    public function dashboard()
    {
        $totalSieges    = User::where('role', 'siege')->count();
        $activeSieges   = User::where('role', 'siege')->where('is_active', true)->count();
        $totalGuichetiers = \App\Models\Guichetier::count();
        $activeGuichetiers = \App\Models\Guichetier::where('is_active', true)->count();
        $totalAgences   = \App\Models\Agence::count();
        $totalClients   = \App\Models\Client::count() ?? 0;
        $totalAccounts  = \App\Models\Account::count() ?? 0;
        $totalOperations = ActivityLog::count() ?? 0;

        $recentAgences = \App\Models\Agence::latest()->take(5)->get();

        $topAgences = \App\Models\Agence::get()
            ->map(function ($agence) {
                $clientsCount = \App\Models\Client::where('agence_id', $agence->id)->count();
                $accountsCount = \App\Models\Account::whereIn('client_id', function ($query) use ($agence) {
                    $query->select('id')->from('clients')->where('agence_id', $agence->id);
                })->count();
                return [
                    'nom' => $agence->nom,
                    'ville' => $agence->ville,
                    'id' => $agence->id,
                    'clients_count' => $clientsCount,
                    'accounts_count' => $accountsCount,
                ];
            })
            ->sortByDesc('clients_count')
            ->take(3)
            ->values()
            ->all();

        $recentLogs = ActivityLog::with('user')
            ->latest()
            ->take(8)
            ->get()
            ->map(function ($log) {
                return [
                    'id'         => $log->id,
                    'action'     => $log->action,
                    'description'=> $log->description,
                    'user_name'  => $log->user ? ($log->user->nom . ' ' . $log->user->prenom) : 'Système',
                    'created_at' => $log->created_at,
                ];
            });

        // ── Monthly stats for the last 6 months ──────────────────────────────
        $months      = [];
        $monthLabels = [];
        for ($i = 5; $i >= 0; $i--) {
            $months[]      = \Carbon\Carbon::now()->subMonths($i);
            $monthLabels[] = \Carbon\Carbon::now()->subMonths($i)->locale('fr')->isoFormat('MMM');
        }

        $clientsPerMonth = [];
        $accountsPerMonth = [];
        foreach ($months as $month) {
            $clientsPerMonth[] = \App\Models\Client::whereYear('created_at', $month->year)
                ->whereMonth('created_at', $month->month)
                ->count();
            $accountsPerMonth[] = \App\Models\Account::whereYear('created_at', $month->year)
                ->whereMonth('created_at', $month->month)
                ->count();
        }

        return response()->json([
            'stats' => [
                'total_sieges'       => $totalSieges,
                'active_sieges'      => $activeSieges,
                'total_guichetiers'  => $totalGuichetiers,
                'active_guichetiers' => $activeGuichetiers,
                'total_agences'      => $totalAgences,
                'total_clients'      => $totalClients,
                'total_accounts'     => $totalAccounts,
                'total_operations'   => $totalOperations,
            ],
            'recent_agences'    => $recentAgences,
            'top_agences'       => $topAgences,
            'recent_logs'       => $recentLogs,
            'monthly_labels'    => $monthLabels,
            'clients_per_month' => $clientsPerMonth,
            'accounts_per_month'=> $accountsPerMonth,
        ]);
    }

    /**
     * List all siege users
     */
    public function listSieges()
    {
        // Self-heal and shift existing matricules below 10000 to the 10000+ range
        $existingSieges = User::where('role', 'siege')->get();
        foreach ($existingSieges as $s) {
            if (!$s->matricule || intval($s->matricule) < 10000) {
                // Find next matricule >= 10001
                $lastSiege = User::where('role', 'siege')
                    ->whereNotNull('matricule')
                    ->where('matricule', '>=', 10001)
                    ->orderByRaw('CAST(matricule AS UNSIGNED) DESC')
                    ->first();
                $s->matricule = $lastSiege ? intval($lastSiege->matricule) + 1 : 10001;
                $s->save();
            }
        }

        $sieges = User::where('role', 'siege')
            ->orderBy('created_at', 'desc')
            ->get();

        // Get the next auto-increment ID for email preview
        $statement = \Illuminate\Support\Facades\DB::select("SHOW TABLE STATUS LIKE 'users'");
        $nextId = $statement[0]->Auto_increment ?? 1;

        $lastSiege = User::where('role', 'siege')
            ->whereNotNull('matricule')
            ->where('matricule', '>=', 10001)
            ->orderByRaw('CAST(matricule AS UNSIGNED) DESC')
            ->first();
        $nextMatricule = $lastSiege ? intval($lastSiege->matricule) + 1 : 10001;

        return response()->json([
            'sieges' => $sieges,
            'next_id' => $nextId,
            'next_matricule' => $nextMatricule
        ]);
    }

    /**
     * Create a siege user
     */
    public function createSiege(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'cin' => 'required|string|max:20|unique:users,cin',
            'password' => 'required|string|min:8',
            'phone' => 'nullable|string|max:20',
        ]);

        // Generate auto-incremented matricule starting at 10001
        $lastSiege = User::where('role', 'siege')
            ->whereNotNull('matricule')
            ->where('matricule', '>=', 10001)
            ->orderByRaw('CAST(matricule AS UNSIGNED) DESC')
            ->first();
        $matricule = $lastSiege ? intval($lastSiege->matricule) + 1 : 10001;

        $siege = User::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'name' => $request->nom . ' ' . $request->prenom,
            'email' => $request->email,
            'cin' => $request->cin,
            'password' => $request->password,
            'role' => 'siege',
            'matricule' => $matricule,
            'must_change_password' => true,
            'phone' => $request->phone,
        ]);

        ActivityLog::log('create_siege', "Création du siège: {$siege->name}", $siege);

        return response()->json([
            'message' => 'Siège créé avec succès.',
            'siege' => $siege,
        ], 201);
    }

    /**
     * Update a siege user
     */
    public function updateSiege(Request $request, User $siege)
    {
        if ($siege->role !== 'siege') {
            return response()->json(['message' => 'Utilisateur non trouvé.'], 404);
        }

        $request->validate([
            'nom' => 'sometimes|string|max:255',
            'prenom' => 'sometimes|string|max:255',
            'email' => ['sometimes', 'email', Rule::unique('users')->ignore($siege->id)],
            'cin' => ['sometimes', 'string', 'max:20', Rule::unique('users')->ignore($siege->id)],
            'is_active' => 'sometimes|boolean',
            'phone' => 'nullable|string|max:20',
        ]);

        $oldValues = $siege->toArray();
        $data = $request->only(['nom', 'prenom', 'email', 'cin', 'is_active', 'phone']);
        if ($request->has('nom') || $request->has('prenom')) {
            $data['name'] = ($request->nom ?? $siege->nom) . ' ' . ($request->prenom ?? $siege->prenom);
        }
        $siege->update($data);

        ActivityLog::log('update_siege', "Mise à jour du siège: {$siege->name}", $siege, $oldValues, $siege->toArray());

        return response()->json([
            'message' => 'Siège mis à jour avec succès.',
            'siege' => $siege->fresh(),
        ]);
    }

    /**
     * Delete a siege user
     */
    public function deleteSiege(User $siege)
    {
        if ($siege->role !== 'siege') {
            return response()->json(['message' => 'Utilisateur non trouvé.'], 404);
        }

        ActivityLog::log('delete_siege', "Suppression du siège: {$siege->name}", $siege);
        $siege->delete();

        return response()->json(['message' => 'Siège supprimé avec succès.']);
    }

    /**
     * List all agency users
     */
    public function listAgences()
    {
        $agences = User::where('role', 'agence')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['agences' => $agences]);
    }

    /**
     * Create an agency user
     */
    public function createAgence(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'phone' => 'nullable|string|max:20',
            'agency_name' => 'required|string|max:255',
        ]);

        $agencyCode = 'AG' . strtoupper(Str::random(6));
        while (User::where('agency_code', $agencyCode)->exists()) {
            $agencyCode = 'AG' . strtoupper(Str::random(6));
        }

        $agence = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
            'role' => 'agence',
            'must_change_password' => true,
            'phone' => $request->phone,
            'agency_name' => $request->agency_name,
            'agency_code' => $agencyCode,
        ]);

        ActivityLog::log('create_agence', "Création de l'agence: {$agence->agency_name}", $agence);

        return response()->json([
            'message' => 'Agence créée avec succès.',
            'agence' => $agence,
        ], 201);
    }

    /**
     * Update an agency user
     */
    public function updateAgence(Request $request, User $agence)
    {
        if ($agence->role !== 'agence') {
            return response()->json(['message' => 'Utilisateur non trouvé.'], 404);
        }

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => ['sometimes', 'email', Rule::unique('users')->ignore($agence->id)],
            'is_active' => 'sometimes|boolean',
            'phone' => 'nullable|string|max:20',
            'agency_name' => 'sometimes|string|max:255',
        ]);

        $oldValues = $agence->toArray();
        $agence->update($request->only(['name', 'email', 'is_active', 'phone', 'agency_name']));

        ActivityLog::log('update_agence', "Mise à jour de l'agence: {$agence->agency_name}", $agence, $oldValues, $agence->toArray());

        return response()->json([
            'message' => 'Agence mise à jour avec succès.',
            'agence' => $agence->fresh(),
        ]);
    }

    /**
     * Delete an agency user
     */
    public function deleteAgence(User $agence)
    {
        if ($agence->role !== 'agence') {
            return response()->json(['message' => 'Utilisateur non trouvé.'], 404);
        }

        ActivityLog::log('delete_agence', "Suppression de l'agence: {$agence->agency_name}", $agence);
        $agence->delete();

        return response()->json(['message' => 'Agence supprimée avec succès.']);
    }

    /**
     * Get activity logs
     */
    public function activityLogs(Request $request)
    {
        $logs = ActivityLog::with('user')
            ->when($request->action, fn($q) => $q->where('action', $request->action))
            ->when($request->user_id, fn($q) => $q->where('user_id', $request->user_id))
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($logs);
    }
    /**
     * Clear all activity logs
     */
    public function clearLogs()
    {
        ActivityLog::truncate();
        return response()->json(['message' => 'Historique effacé avec succès.']);
    }
}
