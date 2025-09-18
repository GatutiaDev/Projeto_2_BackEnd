# API de Autenticação de Usuários com Node.js e Express

## Descrição

Este projeto é um backend robusto para autenticação de usuários, construído com Node.js, Express e MongoDB. Ele fornece uma base sólida para qualquer aplicação que necessite de um sistema de login e registro, com rotas protegidas e gerenciamento de sessões. A arquitetura segue o padrão Model-View-Controller (MVC) para uma clara separação de responsabilidades.

## Funcionalidades Implementadas

* **Registro de Usuário**: Endpoint para criação de novas contas de usuário, com armazenamento seguro de senhas através de hashing.
* **Autenticação de Usuário**: Endpoint de login que valida as credenciais e inicia uma sessão para o usuário.
* **Gerenciamento de Sessão**: Utiliza `express-session` para manter o usuário autenticado entre as requisições.
* **Rotas Protegidas**: Middleware para verificar se o usuário está autenticado antes de permitir o acesso a rotas restritas.
* **Renderização de Views**: Utiliza Handlebars (`.hbs`) como template engine para renderizar páginas de login, registro e uma página principal.

## Tecnologias Utilizadas

* **Backend**: Node.js, Express.js
* **Banco de Dados**: MongoDB com Mongoose (ODM)
* **Template Engine**: Express Handlebars (`hbs`)
* **Segurança**: `bcryptjs` para hashing de senhas, `express-session` para gerenciamento de sessões.
* **Utilitários**: `body-parser` e `cookie-parser` para manipulação de requisições.

---

## Como Executar o Projeto

### Pré-requisitos

* Node.js e npm instalados.
* Uma instância do MongoDB rodando (localmente ou em um serviço na nuvem como o MongoDB Atlas).

### Passos para Instalação

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/seu-usuario/projeto_2_backend.git](https://github.com/seu-usuario/projeto_2_backend.git)
    cd projeto_2_backend
    ```

2.  **Instale as dependências do projeto:**
    ```bash
    npm install
    ```

3.  **Configure a Conexão com o Banco de Dados:**
    * Abra o arquivo `models/db.js`.
    * Altere a string de conexão do Mongoose para apontar para a sua instância do MongoDB. Exemplo:
        ```javascript
        // models/db.js
        mongoose.connect('mongodb://127.0.0.1:27017/seu-banco-de-dados', { ... });
        ```

4.  **Inicie o servidor:**
    ```bash
    node app.js
    ```
    O servidor estará em execução em `http://localhost:8081`.

## Estrutura do Projeto

* `app.js`: Arquivo de entrada da aplicação. Configura o Express, middlewares, template engine e as rotas.
* `/controllers`: Contém a lógica de negócio da aplicação. `authController.js` lida com o registro e login dos usuários.
* `/models`: Define os schemas do Mongoose. `Usuario.js` representa a coleção de usuários no banco de dados e `db.js` gerencia a conexão.
* `/routes`: Define os endpoints da API. `authRoutes.js` mapeia as URLs para as funções correspondentes no controller.
* `/views`: Contém os arquivos de template `.hbs` que são renderizados e enviados para o cliente.

---
