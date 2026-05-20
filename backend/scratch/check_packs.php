<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$packs = \App\Models\Pack::with('products')->get();
foreach ($packs as $pack) {
    echo "Pack: {$pack->name} (ID: {$pack->id})\n";
    foreach ($pack->products as $product) {
        echo "  - Product: {$product->name} (ID: {$product->id})\n";
    }
}
