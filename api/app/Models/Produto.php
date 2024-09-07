<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Produto extends Model
{
    use HasFactory;

    protected $fillable = [
        'nome',
        'imagem',
        'descricao',
        'preco'
    ];
    
    public function categorias()
    {
        return $this->belongsToMany(Categoria::class, 'categoria_produto');
    }
}
