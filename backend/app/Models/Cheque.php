<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cheque extends Model
{
    use HasFactory;

    protected $fillable = [
        'numero_cheque',
        'account_id',
        'beneficiaire_nom',
        'beneficiaire_prenom',
        'beneficiaire_cin',
        'beneficiaire_cin_expiration',
        'montant',
        'statut',
    ];

    protected $casts = [
        'beneficiaire_cin_expiration' => 'date',
        'montant' => 'decimal:2',
    ];

    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    public function retrait()
    {
        return $this->belongsTo(Retrait::class);
    }

    public function avisRejet()
    {
        return $this->hasOne(AvisRejetCheque::class);
    }
}
