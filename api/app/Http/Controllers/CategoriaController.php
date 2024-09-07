<?php

namespace App\Http\Controllers;

use App\Http\Requests\ArticleCategoriaRequest;
use App\Models\Categoria;
use Illuminate\Http\Request;

class CategoriaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $categorias = Categoria::orderBy('created_at', 'desc')->get();
        return response()->json($categorias);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ArticleCategoriaRequest $request)
    {
        if(Categoria::create($request->validated())){
            return response()->json([
                'message' => 'Categoria cadastrada com sucesso'
            ]);
        }

        return response()->json([
            'message'=> 'Erro ao cadastrar a categoria'
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $categoria = Categoria::find($id);

        if($categoria){
            return response()->json($categoria);
        }
        
        return response()->json([
            'message' => 'Erro ao buscar a categoria'
        ], 404);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(ArticleCategoriaRequest $request, $id)
    {
        $categoria = Categoria::find($id);
        if($categoria){
            $data = $request->validated();
            $categoria->update($data);
            return response()->json([
                'message' => 'Categoria atualizada com sucesso'
            ]);
        }

        return response()->json([
            'message'=> 'Erro ao editar a categoria'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        if(Categoria::destroy($id)){
            return response()->json([
                'message'=> 'Categoria excluída com sucesso'
            ]);
        }

        return response()->json([
            'message'=> 'Erro ao excluir ao excluir a categoria'
        ]);
    }
}
