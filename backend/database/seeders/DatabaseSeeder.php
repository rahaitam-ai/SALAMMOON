<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create Admin user
        User::create([
            'name' => 'Haitam RA',
            'email' => 'ra.haitam@gmail.com',
            'password' => 'Admin@2024',
            'role' => 'admin',
            'must_change_password' => false,
            'is_active' => true,
        ]);

        // Create a demo Siege user
        User::create([
            'name' => 'Siège Central',
            'email' => 'siege@baridbank.ma',
            'password' => 'Siege@2024',
            'role' => 'siege',
            'must_change_password' => true,
            'is_active' => true,
        ]);

        // Create a demo Agency user
        User::create([
            'name' => 'Agence Casablanca',
            'email' => 'agence@baridbank.ma',
            'password' => 'Agence@2024',
            'role' => 'agence',
            'must_change_password' => true,
            'is_active' => true,
            'agency_name' => 'Agence Casablanca Centre',
            'agency_code' => 'AG001CAS',
        ]);
    }
}
