// ===================================================
// 1. IMPORTAÇÕES E CONFIGURAÇÃO INICIAL
// ===================================================
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const path = require("path");
const { MongoClient } = require("mongodb"); // Driver do MongoDB
const bcrypt = require("bcryptjs"); // Biblioteca para Hashing de senhas

const app = express();
const port = 3000;

// --- Configuração da Conexão com o MongoDB ---
// IMPORTANTE: Substitua pela sua string de conexão do MongoDB Atlas ou local.
const mongoURI = "mongodb://localhost:27017";
const dbName = "auth_app"; // Nome do banco de dados
let db;

// Função para conectar ao banco de dados
async function connectToDb() {
  try {
    const client = new MongoClient(mongoURI);
    await client.connect();
    db = client.db(dbName);
    console.log("Conectado ao MongoDB com sucesso!");
  } catch (err) {
    console.error("Falha ao conectar ao MongoDB", err);
    process.exit(1); // Encerra o processo se não conseguir conectar
  }
}

// ===================================================
// 2. CONFIGURAÇÃO DO TEMPLATE ENGINE (HBS)
// ===================================================
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// ===================================================
// 3. CONFIGURAÇÃO DOS MIDDLEWARES
// ===================================================
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: "meu_segredo_super_dificil",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 * 10 }, // 10 minutos
  })
);

// ===================================================
// 4. DEFINIÇÃO DO MIDDLEWARE DE AUTENTICAÇÃO
// ===================================================
function checkLogin(req, res, next) {
  if (req.session.logado) {
    next();
  } else {
    res.redirect("/login");
  }
}

// ===================================================
// 5. DEFINIÇÃO DAS ROTAS
// ===================================================

// --- ROTAS PÚBLICAS ---

// Rota para exibir a página de login
app.get("/login", (req, res) => {
  res.render("login");
});

// Rota para exibir a página de registro
app.get("/register", (req, res) => {
  res.render("register");
});

// Rota para processar o registro de um novo usuário
app.post("/register", async (req, res) => {
  try {
    const { usuario, senha } = req.body;
    const usersCollection = db.collection("users");

    // Verifica se o usuário já existe
    const existingUser = await usersCollection.findOne({ usuario: usuario });
    if (existingUser) {
      return res.send(
        'Este nome de usuário já está em uso. <a href="/register">Tente outro</a>'
      );
    }

    // Gera o hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(senha, salt);

    // Insere o novo usuário no banco de dados
    await usersCollection.insertOne({
      usuario: usuario,
      senha: hashedPassword,
    });

    console.log(`Usuário ${usuario} registrado com sucesso.`);
    res.redirect("/login");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao registrar usuário.");
  }
});

// Rota para processar os dados do formulário de login com MongoDB
app.post("/login", async (req, res) => {
  try {
    const { usuario, senha } = req.body;
    const usersCollection = db.collection("users");

    // 1. Encontra o usuário no banco de dados
    const user = await usersCollection.findOne({ usuario: usuario });

    // Se o usuário não for encontrado
    if (!user) {
      return res.send(
        'Usuário ou senha inválidos. <a href="/login">Tentar de novo</a>'
      );
    }

    // 2. Compara a senha enviada com o hash salvo no banco
    const isMatch = await bcrypt.compare(senha, user.senha);

    // Se a senha não corresponder
    if (!isMatch) {
      return res.send(
        'Usuário ou senha inválidos. <a href="/login">Tentar de novo</a>'
      );
    }

    // 3. Se tudo estiver correto, cria a sessão
    req.session.logado = true;
    req.session.usuario = user.usuario; // Opcional: guardar o nome do usuário na sessão
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro no servidor durante o login.");
  }
});

// Rota para fazer logout
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send("Erro ao fazer logout.");
    }
    res.redirect("/login");
  });
});

// --- ROTAS PROTEGIDAS ---

// Rota principal (protegida)
app.get("/", checkLogin, (req, res) => {
  // Passa o nome do usuário para a view, se estiver na sessão
  res.render("index", { usuario: req.session.usuario });
});

// ===================================================
// 6. INICIALIZAÇÃO DO SERVIDOR
// ===================================================
// Conecta ao banco de dados e então inicia o servidor Express
connectToDb().then(() => {
  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  });
});
