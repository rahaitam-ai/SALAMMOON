<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'nom',
        'prenom',
        'name',
        'email',
        'cin',
        'password',
        'role',
        'matricule',
        'must_change_password',
        'is_active',
        'phone',
        'agency_name',
        'agency_code',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'must_change_password' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isSiege(): bool
    {
        return $this->role === 'siege';
    }

    public function isAgence(): bool
    {
        return $this->role === 'agence';
    }


    public function activityLogs()
    {
        return $this->hasMany(ActivityLog::class);
    }
}
