<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_number',
        'civilite',
        'nom',
        'prenom',
        'cin',
        'nationalite',
        'phone',
        'email',
        'adresse',
        'date_naissance',
        'date_expiration_cin',
        'profession',
        'agence_id',
        'created_by',
    ];

    public function agence()
    {
        return $this->belongsTo(Agence::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function accounts()
    {
        return $this->hasMany(Account::class);
    }
}
