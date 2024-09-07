<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ArticleProdutoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return $this->user()->can('admin-access');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'nome' => 'required|min:5|max:255',
            'imagem' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048', 
            'descricao' => 'required|string|min:5|max:255',
            'preco' => 'required|numeric|regex:/^\d+(\.\d{1,2})?$/',
        ];
    }
}
