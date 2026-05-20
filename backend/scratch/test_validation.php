<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;

$user = User::where('email', 'agence@baridbank.ma')->first();
Auth::login($user);

$data = [
    'first_name' => 'Test',
    'last_name' => 'Validation',
    'cin' => 'TEST'.rand(1000,9999),
    'cin_expiration_date' => '2030-01-01',
    'address' => 'Test Address',
    'phone' => '0600000000',
    'pack_id' => 6,
    'account_type' => 'current',
    'product_ids' => [999] // Invalid ID
];

$request = Illuminate\Http\Request::create('/api/agence/clients', 'POST', $data);
$response = app()->handle($request);

echo $response->getContent();
