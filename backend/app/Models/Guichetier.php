<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Guichetier extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'nom',
        'prenom',
        'cin',
        'numero_guichetier',
        'agence_id',
        'email',
        'password',
        'must_change_password',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'must_change_password' => 'boolean',
            'is_active' => 'boolean',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the role of the guichetier (for middleware compatibility)
     */
    public function getRoleAttribute()
    {
        return 'guichetier';
    }

    public function agence()
    {
        return $this->belongsTo(Agence::class);
    }
}
