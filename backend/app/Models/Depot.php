<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Depot extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference_operation',
        'account_id',
        'numero_compte',
        'rib',
        'nom',
        'prenom',
        'cin',
        'date_expiration_cin',
        'adresse',
        'montant',
        'ancien_solde',
        'nouveau_solde',
        'type_depot',
        'nom_cheque',
        'prenom_cheque',
        'numero_serie_cheque',
        'date_cheque',
        'date_depot',
        'heure_depot',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'montant' => 'decimal:2',
            'ancien_solde' => 'decimal:2',
            'nouveau_solde' => 'decimal:2',
            'date_expiration_cin' => 'date',
            'date_cheque' => 'date',
            'date_depot' => 'date',
        ];
    }

    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
