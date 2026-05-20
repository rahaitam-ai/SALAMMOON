<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'type',
        'description',
        'card_type',
        'account_type',
        'fee',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'fee' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    public function packs()
    {
        return $this->belongsToMany(Pack::class, 'pack_product')->withTimestamps();
    }

    public function accounts()
    {
        return $this->belongsToMany(Account::class, 'account_product')->withTimestamps();
    }
}
