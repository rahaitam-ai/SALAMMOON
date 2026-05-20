<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AccountType;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class AccountTypeController extends Controller
{
    public function index()
    {
        return response()->json(AccountType::latest()->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:account_types,name',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $accountType = AccountType::create($request->all());

        ActivityLog::log('create_account_type', "Création du type de compte: {$accountType->name}", $accountType);

        return response()->json([
            'message' => 'Type de compte créé avec succès',
            'account_type' => $accountType
        ], 201);
    }

    public function update(Request $request, AccountType $accountType)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:account_types,name,' . $accountType->id,
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $oldValues = $accountType->toArray();
        $accountType->update($request->all());

        ActivityLog::log('update_account_type', "Mise à jour du type de compte: {$accountType->name}", $accountType, $oldValues, $accountType->toArray());

        return response()->json([
            'message' => 'Type de compte mis à jour avec succès',
            'account_type' => $accountType
        ]);
    }

    public function destroy(AccountType $accountType)
    {
        ActivityLog::log('delete_account_type', "Suppression du type de compte: {$accountType->name}", $accountType);
        $accountType->delete();
        return response()->json(['message' => 'Type de compte supprimé']);
    }
}
