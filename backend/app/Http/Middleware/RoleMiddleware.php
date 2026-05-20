<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();
        
        // Flatten roles in case they were passed as a single comma-separated string
        $allowedRoles = [];
        foreach ($roles as $role) {
            $allowedRoles = array_merge($allowedRoles, explode(',', $role));
        }

        if (!$user || !in_array($user->role, $allowedRoles)) {
            return response()->json([
                'message' => 'Accès non autorisé. Rôle insuffisant.',
            ], 403);
        }

        if (!$user->is_active) {
            return response()->json([
                'message' => 'Votre compte a été désactivé.',
            ], 403);
        }

        return $next($request);
    }
}
