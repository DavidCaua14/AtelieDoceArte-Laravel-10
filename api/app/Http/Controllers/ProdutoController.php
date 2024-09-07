<?php

namespace App\Http\Controllers;

use App\Http\Requests\ArticleProdutoRequest;
use App\Models\Produto;
use Illuminate\Http\Request;
use Storage;

class ProdutoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $categoryId = $request->query('category_id');

        if ($categoryId) {
            // Busca os produtos vinculados à categoria específica e ordena pelos mais recentes
            $produtos = Produto::whereHas('categorias', function ($query) use ($categoryId) {
                $query->where('categorias.id', $categoryId);
            })->orderBy('created_at', 'desc')->get();
        } else {
            // Se não for passado nenhum ID de categoria, retorna todos os produtos ordenados pelos mais recentes
            $produtos = Produto::orderBy('created_at', 'desc')->get();
        }

        return response()->json($produtos);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ArticleProdutoRequest $request)
    {
        $data = $request->validated();
        $data = $this->armazenaImagem($request, $data);

        $produto = Produto::create($data);

        if ($produto) {
            // Associar categorias ao produto
            if ($request->has('categorias')) {
                $produto->categorias()->sync($request->categorias);
            }

            return response()->json(['message' => 'Produto cadastrado com sucesso']);
        }

        return response()->json(['message' => 'Erro ao cadastrar o produto'], 500);
    }

    private function armazenaImagem(Request $request, array $data)
    {
        if ($request->hasFile('imagem')) {
            $path = $request->file('imagem')->store('produtos', 'public');
            $data['imagem'] = $path;
        }
        return $data;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $produto = Produto::with('categorias')->find($id);

        if ($produto) {
            return response()->json($produto);
        }

        return response()->json([
            'message' => 'Erro ao buscar o produto'
        ], 404);
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(ArticleProdutoRequest $request, $id)
    {
        $produto = Produto::findOrFail($id);
        $data = $request->validated();

        // Atualiza a imagem e passa o produto existente
        $data = $this->armazenaUpdateImagem($request, $data, $produto);

        // Atualiza o produto com os novos dados
        $produto->update($data);

        if ($request->has('categorias')) {
            $produto->categorias()->sync($request->categorias);
        }

        return response()->json(['message' => 'Produto atualizado com sucesso']);
    }
    private function armazenaUpdateImagem(Request $request, array $data, Produto $produto)
    {
        if ($request->hasFile('imagem')) {
            // Deleta a imagem anterior, se existir
            if ($produto->imagem) {
                Storage::disk('public')->delete($produto->imagem);
            }
            
            // Armazena a nova imagem
            $path = $request->file('imagem')->store('produtos', 'public');
            $data['imagem'] = $path;
        }
        return $data;
    }



    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        if(Produto::destroy($id)){
            return response()->json([
                'message'=> 'Produto excluída com sucesso'
            ]);
        }

        return response()->json([
            'message'=> 'Erro ao excluir ao excluir o produto'
        ]);
    }
}
