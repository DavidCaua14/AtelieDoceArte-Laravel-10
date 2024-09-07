# Ateliê Doce e Arte

Ateliê Doce e Arte é um aplicativo para gerenciar a venda de doces

## Detalhes
| Tecnologia |
|---|
| Laravel 10 REST API
| React Native

## Resumo das Funcionalidaedes
- Gerenciar Produtos
- Gerenciar Categorias
- Login e Cadastro de Usuário

## Como executar?
**Importante:** É necessário ter o composer, NodeJs e o PHP 8.1.28 ou superior instalados.
- Abra o terminal na pasta api e rode o seguinte comando: 
``` composer install ```
- Após isso execute o comando para rodar a aplicação:
``` php artisan serve ```

- Abra o terminal na pasta doceria e rode o seguinte comando: 
``` npm install ```
- Após isso execute o comando para rodar a aplicação: 
``` npm start ```
**Importante:** Baixe o expo go no seu celular e esteja na mesma rede que o backend está rodando e leia o qrcode do terminal da pasta doceria.

## Usuário Adminstrador
Faça o login com o usuário administrador para ter acesso a todas as funcionalidades. 

- Email: admin@gmail.com
- Senha: 12345678

## Documentação da API

#### Gerenciamento de Produtos

```http 
  POST /api/produto
  GET /api/produtos
  POST /api/produto/{id}
  GET /api/produto/{id}
  DELETE /api/produto/{id}
```

#### Gerenciamento de Categorias

```http 
  POST /api/categoria
  GET /api/categorias
  PUT /api/categoria/{id}
  GET /api/categoria/{id}
  DELETE /api/categoria/{id}
```

#### Login e Cadastro de Usuário

```http 
  POST /api/login
  POST /api/register
```