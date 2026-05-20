<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Pack;
use Illuminate\Http\Request;

class AgenceController extends Controller
{
    /**
     * Dashboard stats
     */
    public function dashboard(Request $request)
    {
        $user = auth()->user();
        $userId = $user->id;
        
        // Get Agence ID - handle different user models if necessary
        $agenceId = $user->agence_id ?? ($user->guichetier ? $user->guichetier->agence_id : null);

        $totalClients = \App\Models\Client::where('agence_id', $agenceId)->count();
        $totalAccounts = \App\Models\Account::whereHas('client', function($q) use ($agenceId) {
            $q->where('agence_id', $agenceId);
        })->count();
        
        $newClientsThisMonth = \App\Models\Client::where('created_by', $userId)
            ->whereMonth('created_at', now()->month)
            ->count();

        // Efficacité = % de clients ayant au moins un compte actif
        $clientsWithAccount = \App\Models\Client::where('agence_id', $agenceId)
            ->whereHas('accounts')
            ->count();
        $efficiency = $totalClients > 0
            ? round(($clientsWithAccount / $totalClients) * 100, 1) . '%'
            : '0%';

        $recentClients = \App\Models\Client::where('created_by', $userId)
            ->withCount('accounts')
            ->latest()
            ->take(10)
            ->get();

        // Get chart data for last 7 days (Account openings)
        $chartData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = \Carbon\Carbon::today()->subDays($i);
            $count = \App\Models\Account::whereDate('created_at', $date)
                ->whereHas('client', function($q) use ($agenceId) {
                    $q->where('agence_id', $agenceId);
                })
                ->count();
            $chartData[] = $count;
        }

        return response()->json([
            'stats' => [
                'total_clients'   => $totalClients,
                'active_accounts' => $totalAccounts,
                'new_this_month'  => $newClientsThisMonth,
                'efficiency'      => $efficiency,
            ],
            'chart_data'      => $chartData,
            'recent_clients'  => $recentClients,
        ]);
    }

    /**
     * Get available packs (might still be useful for other things, but removing if requested)
     */
    public function availablePacks()
    {
        $packs = Pack::where('is_active', true)->with('products')->get();
        return response()->json(['packs' => $packs]);
    }
}
