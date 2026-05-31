<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AvisRejetCheque extends Model
{
    use HasFactory;

    protected $fillable = [
        'cheque_id',
        'motif',
        'pdf_path',
    ];

    public function cheque()
    {
        return $this->belongsTo(Cheque::class);
    }
}
