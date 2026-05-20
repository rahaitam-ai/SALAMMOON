<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Pack;
use App\Models\Product;
use App\Models\Agence;
use App\Models\AccountType;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SiegeController extends Controller
{
    /**
     * Dashboard stats
     */
    public function dashboard()
    {
        return response()->json([
            'stats' => [
                'total_packs' => Pack::count(),
                'active_packs' => Pack::where('is_active', true)->count(),
                'total_products' => Product::count(),
                'card_products' => Product::where('type', 'card')->count(),
                'account_products' => Product::where('type', 'account')->count(),
                'service_products' => Product::where('type', 'service')->count(),
                'total_agences' => Agence::count(),
                'active_agences' => Agence::where('is_active', true)->count(),
                'total_account_types' => AccountType::count(),
                'total_clients' => \App\Models\Client::count(),
            ],
            'packs' => Pack::with('products')->latest()->get(),
        ]);
    }

    // ==================== PACKS ====================

    public function listPacks()
    {
        $packs = Pack::with('products')->orderBy('created_at', 'desc')->get();
        return response()->json(['packs' => $packs]);
    }

    public function createPack(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:packs,code',
            'monthly_fee' => 'required|numeric|min:0',
            'product_ids' => 'required|array|min:1',
            'product_ids.*' => 'exists:products,id',
        ], [
            'product_ids.required' => 'Un pack doit contenir au moins un produit.',
            'product_ids.min' => 'Un pack doit contenir au moins un produit.',
        ]);

        $pack = Pack::create($request->only(['name', 'code', 'monthly_fee']));

        if ($request->has('product_ids')) {
            $pack->products()->sync($request->product_ids);
        }

        ActivityLog::log('create_pack', "Création du pack: {$pack->name}", $pack);

        return response()->json([
            'message' => 'Pack créé avec succès.',
            'pack' => $pack->load('products'),
        ], 201);
    }

    public function showPack(Pack $pack)
    {
        return response()->json(['pack' => $pack->load('products')]);
    }

    public function updatePack(Request $request, Pack $pack)
    {
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'code' => ['sometimes', 'string', 'max:50', Rule::unique('packs')->ignore($pack->id)],
            'monthly_fee' => 'sometimes|numeric|min:0',
            'is_active' => 'sometimes|boolean',
            'product_ids' => 'nullable|array',
            'product_ids.*' => 'exists:products,id',
        ]);

        $oldValues = $pack->toArray();
        $pack->update($request->only(['name', 'code', 'monthly_fee', 'is_active']));

        if ($request->has('product_ids')) {
            $pack->products()->sync($request->product_ids);
        }

        ActivityLog::log('update_pack', "Mise à jour du pack: {$pack->name}", $pack, $oldValues, $pack->toArray());

        return response()->json([
            'message' => 'Pack mis à jour avec succès.',
            'pack' => $pack->load('products'),
        ]);
    }

    public function deletePack(Pack $pack)
    {
        ActivityLog::log('delete_pack', "Suppression du pack: {$pack->name}", $pack);
        $pack->delete();

        return response()->json(['message' => 'Pack supprimé avec succès.']);
    }

    // ==================== PRODUCTS ====================

    public function listProducts(Request $request)
    {
        $products = Product::query()
            ->when($request->type, fn($q) => $q->where('type', $request->type))
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['products' => $products]);
    }

    public function createProduct(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:products,code',
            'type' => 'required|in:card,account,service',
            'description' => 'nullable|string|max:1000',
            'card_type' => 'nullable|required_if:type,card|string|max:100',
            'account_type' => 'nullable|required_if:type,account|string|max:100',
            'fee' => 'required|numeric|min:0',
        ]);

        $product = Product::create($request->only([
            'name', 'code', 'type', 'description', 'card_type', 'account_type', 'fee'
        ]));

        ActivityLog::log('create_product', "Création du produit: {$product->name}", $product);

        return response()->json([
            'message' => 'Produit créé avec succès.',
            'product' => $product,
        ], 201);
    }

    public function showProduct(Product $product)
    {
        return response()->json(['product' => $product->load('packs')]);
    }

    public function updateProduct(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'code' => ['sometimes', 'string', 'max:50', Rule::unique('products')->ignore($product->id)],
            'type' => 'sometimes|in:card,account,service',
            'description' => 'nullable|string|max:1000',
            'card_type' => 'nullable|string|max:100',
            'account_type' => 'nullable|string|max:100',
            'fee' => 'sometimes|numeric|min:0',
            'is_active' => 'sometimes|boolean',
        ]);

        $oldValues = $product->toArray();
        $product->update($request->only([
            'name', 'code', 'type', 'description', 'card_type', 'account_type', 'fee', 'is_active'
        ]));

        ActivityLog::log('update_product', "Mise à jour du produit: {$product->name}", $product, $oldValues, $product->toArray());

        return response()->json([
            'message' => 'Produit mis à jour avec succès.',
            'product' => $product,
        ]);
    }

    public function deleteProduct(Product $product)
    {
        ActivityLog::log('delete_product', "Suppression du produit: {$product->name}", $product);
        $product->delete();

        return response()->json(['message' => 'Produit supprimé avec succès.']);
    }
}
