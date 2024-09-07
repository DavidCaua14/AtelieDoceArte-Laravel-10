<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProdutoCategoria extends Model
{
    use HasFactory;
    protected $table = 'produto_categoria';

    public $timestamps = false;

    protected $fillable = [
        'produto_id',
        'categoria_id',
    ];

    
}
