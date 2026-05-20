<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$clients = \App\Models\Client::with('products')->get();
foreach ($clients as $client) {
    echo "Client: {$client->first_name} {$client->last_name} (ID: {$client->id})\n";
    foreach ($client->products as $product) {
        echo "  - Product ID: {$product->id}\n";
    }
}
