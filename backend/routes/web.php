<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

use App\Http\Controllers\SiegeMemberController;

Route::get('/siege-members/create', [SiegeMemberController::class, 'create'])->name('siege_members.create');
Route::post('/siege-members', [SiegeMemberController::class, 'store'])->name('siege_members.store');
