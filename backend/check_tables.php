<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=== Structure of retraits table ===\n";
try {
    $columns = DB::select('SHOW COLUMNS FROM retraits');
    foreach ($columns as $col) {
        echo "Field: {$col->Field}, Type: {$col->Type}, Null: {$col->Null}, Key: {$col->Key}, Default: {$col->Default}, Extra: {$col->Extra}\n";
    }
} catch (\Exception $e) {
    echo "Error checking retraits table: {$e->getMessage()}\n";
}

echo "\n=== Structure of cheques table ===\n";
try {
    $columns = DB::select('SHOW COLUMNS FROM cheques');
    foreach ($columns as $col) {
        echo "Field: {$col->Field}, Type: {$col->Type}, Null: {$col->Null}, Key: {$col->Key}, Default: {$col->Default}, Extra: {$col->Extra}\n";
    }
} catch (\Exception $e) {
    echo "Error checking cheques table: {$e->getMessage()}\n";
}

echo "\n=== Structure of avis_rejet_cheques table ===\n";
try {
    $columns = DB::select('SHOW COLUMNS FROM avis_rejet_cheques');
    foreach ($columns as $col) {
        echo "Field: {$col->Field}, Type: {$col->Type}, Null: {$col->Null}, Key: {$col->Key}, Default: {$col->Default}, Extra: {$col->Extra}\n";
    }
} catch (\Exception $e) {
    echo "Error checking avis_rejet_cheques table: {$e->getMessage()}\n";
}
