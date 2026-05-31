<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Retrait extends Model
{
    use HasFactory;

    protected $fillable = [
        'account_id',
        'type_retrait',
        'montant',
        'solde_avant',
        'solde_apres',
        'guichetier_id',
        'date_operation',
    ];

    protected $casts = [
        'montant' => 'decimal:2',
        'solde_avant' => 'decimal:2',
        'solde_apres' => 'decimal:2',
        'date_operation' => 'datetime',
    ];

    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    public function guichetier()
    {
        return $this->belongsTo(User::class, 'guichetier_id');
    }

    public function cheque()
    {
        return $this->hasOne(Cheque::class);
    }
}
