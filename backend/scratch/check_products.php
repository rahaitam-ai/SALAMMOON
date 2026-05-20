<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$products = \App\Models\Product::all(['id', 'name', 'code']);
echo json_encode($products, JSON_PRETTY_PRINT);
