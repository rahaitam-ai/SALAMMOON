<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Account extends Model
{
    use HasFactory;

    protected $fillable = [
        'numero_compte',
        'rib',
        'balance',
        'client_id',
        'account_type_id',
        'pack_id',
        'is_active',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'balance' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function type()
    {
        return $this->belongsTo(AccountType::class, 'account_type_id');
    }

    public function pack()
    {
        return $this->belongsTo(Pack::class);
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'account_product')->withTimestamps();
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function depots()
    {
        return $this->hasMany(Depot::class);
    }

    public function retraits()
    {
        return $this->hasMany(Retrait::class);
    }

    public function cheques()
    {
        return $this->hasMany(Cheque::class);
    }
}
