<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AgenceController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SiegeController;
use App\Http\Controllers\Api\AccountTypeController;
use App\Http\Middleware\RoleMiddleware;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::post('/login', [AuthController::class, 'login']);

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);

    // Admin routes
    Route::middleware(RoleMiddleware::class . ':admin')->prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard']);

        // Siege management
        Route::get('/sieges', [AdminController::class, 'listSieges']);
        Route::post('/sieges', [AdminController::class, 'createSiege']);
        Route::put('/sieges/{siege}', [AdminController::class, 'updateSiege']);
        Route::delete('/sieges/{siege}', [AdminController::class, 'deleteSiege']);

        // Guichetiers management
        Route::get('/guichetiers/villes', [\App\Http\Controllers\GuichetierController::class, 'getVilles']);
        Route::get('/guichetiers/agences-par-ville/{ville}', [\App\Http\Controllers\GuichetierController::class, 'getAgencesByVille']);
        Route::get('/guichetiers', [\App\Http\Controllers\GuichetierController::class, 'index']);
        Route::post('/guichetiers', [\App\Http\Controllers\GuichetierController::class, 'store']);
        Route::put('/guichetiers/{id}', [\App\Http\Controllers\GuichetierController::class, 'update']);
        Route::delete('/guichetiers/{id}', [\App\Http\Controllers\GuichetierController::class, 'destroy']);

        // Physical Agences table management
        Route::get('/agences-physiques', [\App\Http\Controllers\AgenceController::class, 'index']);
        Route::get('/agences-physiques/:id', [\App\Http\Controllers\AgenceController::class, 'show']);
        Route::post('/agences-physiques', [\App\Http\Controllers\AgenceController::class, 'store']);
        Route::put('/agences-physiques/:id', [\App\Http\Controllers\AgenceController::class, 'update']);
        Route::delete('/agences-physiques/:id', [\App\Http\Controllers\AgenceController::class, 'destroy']);

        // Activity logs
        Route::get('/logs', [AdminController::class, 'activityLogs']);
        Route::delete('/logs', [AdminController::class, 'clearLogs']);
    });

    // Siege routes
    Route::middleware(RoleMiddleware::class . ':siege')->prefix('siege')->group(function () {
        Route::get('/dashboard', [SiegeController::class, 'dashboard']);

        // Packs
        Route::get('/packs', [SiegeController::class, 'listPacks']);
        Route::post('/packs', [SiegeController::class, 'createPack']);
        Route::get('/packs/{pack}', [SiegeController::class, 'showPack']);
        Route::put('/packs/{pack}', [SiegeController::class, 'updatePack']);
        Route::delete('/packs/{pack}', [SiegeController::class, 'deletePack']);

        // Products
        Route::get('/products', [SiegeController::class, 'listProducts']);
        Route::post('/products', [SiegeController::class, 'createProduct']);
        Route::get('/products/{product}', [SiegeController::class, 'showProduct']);
        Route::put('/products/{product}', [SiegeController::class, 'updateProduct']);
        Route::delete('/products/{product}', [SiegeController::class, 'deleteProduct']);

        // Agences (Consulter les Agences)
        Route::get('/agences', [\App\Http\Controllers\AgenceController::class, 'index']);
        Route::get('/agences/:id', [\App\Http\Controllers\AgenceController::class, 'show']);

        // Account Types
        Route::get('/account-types', [AccountTypeController::class, 'index']);
        Route::post('/account-types', [AccountTypeController::class, 'store']);
        Route::put('/account-types/{accountType}', [AccountTypeController::class, 'update']);
        Route::delete('/account-types/{accountType}', [AccountTypeController::class, 'destroy']);
    });

    // Retrait d'Argent routes
    Route::middleware(RoleMiddleware::class . ':agence,guichetier')->group(function () {
        Route::get('/clients/search', [\App\Http\Controllers\Api\RetraitController::class, 'searchClient']);
        Route::get('/comptes/by-client', [\App\Http\Controllers\Api\RetraitController::class, 'getAccountsByClient']);
        Route::get('/retraits', [\App\Http\Controllers\Api\RetraitController::class, 'index']);
        Route::post('/retraits', [\App\Http\Controllers\Api\RetraitController::class, 'store']);
        Route::get('/retraits/{id}', [\App\Http\Controllers\Api\RetraitController::class, 'show']);
        Route::get('/retraits/{id}/recu', [\App\Http\Controllers\Api\RetraitController::class, 'recuPdf']);
        Route::post('/certificat-non-paiement', [\App\Http\Controllers\Api\RetraitController::class, 'storeCertificat']);
        Route::get('/certificat-non-paiement/{id}/pdf', [\App\Http\Controllers\Api\RetraitController::class, 'certificatPdf']);
    });

    // Vérification de compte (pour dépôts et retraits)
    Route::middleware(RoleMiddleware::class . ':agence,guichetier')->group(function () {
        Route::post('/accounts/verify', [\App\Http\Controllers\Api\DepotController::class, 'verifyAccount']);
    });

    // Routes partagées pour la gestion opérationnelle
    Route::middleware(RoleMiddleware::class . ':siege,agence,guichetier')->group(function () {
        Route::get('clients/get-next-number', [\App\Http\Controllers\Api\ClientController::class, 'getNextNumber']);
        Route::apiResource('clients', \App\Http\Controllers\Api\ClientController::class);
        Route::get('accounts/get-next-number', [\App\Http\Controllers\Api\AccountController::class, 'getNextNumber']);
        Route::get('accounts/form-data', [\App\Http\Controllers\Api\AccountController::class, 'getFormData']);
        Route::get('accounts/{id}/pdf', [\App\Http\Controllers\Api\AccountController::class, 'generatePdf']);
        Route::get('accounts/{id}/rib-pdf', [\App\Http\Controllers\Api\AccountController::class, 'generateRibPdf']);
        Route::get('accounts/{id}/attestation-solde-pdf', [\App\Http\Controllers\Api\AccountController::class, 'generateAttestationSoldePdf']);
        Route::get('accounts/{id}/historique-pdf', [\App\Http\Controllers\Api\AccountController::class, 'generateHistoryPdf']);
        Route::get('accounts/{id}/operations', [\App\Http\Controllers\Api\AccountController::class, 'operationsHistory']);
        Route::apiResource('accounts', \App\Http\Controllers\Api\AccountController::class);
    });

    // Agence routes
    Route::middleware(RoleMiddleware::class . ':agence,guichetier')->prefix('agence')->group(function () {
        Route::get('/dashboard', [AgenceController::class, 'dashboard']);
    });

    // Dépôt d'Argent routes
    Route::middleware(RoleMiddleware::class . ':agence,guichetier')->group(function () {
        Route::get('/comptes/recherche', [\App\Http\Controllers\Api\DepotController::class, 'rechercheCompte']);
        Route::get('/depots', [\App\Http\Controllers\Api\DepotController::class, 'index']);
        Route::post('/depots', [\App\Http\Controllers\Api\DepotController::class, 'store']);
        Route::get('/depots/{id}', [\App\Http\Controllers\Api\DepotController::class, 'show']);
        Route::get('/depots/{id}/recu', [\App\Http\Controllers\Api\DepotController::class, 'recuPdf']);
    });
});
