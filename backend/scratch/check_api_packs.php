<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$packs = \App\Models\Pack::where('is_active', true)->with('products')->get();
echo json_encode(['packs' => $packs], JSON_PRETTY_PRINT);
