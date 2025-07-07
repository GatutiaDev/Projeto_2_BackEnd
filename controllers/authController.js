const Usuario = require("../models/Usuario");

exports.renderLoginPage = (req, res) => {
  res.render("login");
};

exports.renderRegisterPage = (req, res) => {
  res.render("register");
};

exports.renderHomePage = (req, res) => {
  res.render("index", { usuario: req.session.usuario });
};

exports.processRegister = async (req, res) => {
  try {
    const { nome, senha } = req.body;

    const existingUsers = await Usuario.buscar({ nome: nome });

    if (existingUsers && existingUsers.length > 0) {
      return res.send(
        'Este nome de usuário já está em uso. <a href="/register">Tente outro</a>'
      );
    }

    const novoUsuario = new Usuario(nome, senha);

    const resultado = await novoUsuario.inserir();

    if (resultado) {
      console.log(`Usuário ${nome} registrado com sucesso.`);
      res.redirect("/login");
    } else {
      throw new Error(
        "Ocorreu um erro ao inserir o usuário no banco de dados."
      );
    }
  } catch (err) {
    console.error("Erro no processRegister:", err);
    res.status(500).send("Erro interno ao registrar usuário.");
  }
};

exports.processLogin = async (req, res) => {
  try {
    const { nome, senha } = req.body;

    const usuarioValidado = await Usuario.validarLogin(nome, senha);

    if (usuarioValidado) {
      req.session.logado = true;

      req.session.usuario = usuarioValidado.nome;

      res.redirect("/");
    } else {
      res.send(
        'Usuário ou senha inválidos. <a href="/login">Tentar de novo</a>'
      );
    }
  } catch (err) {
    console.error("Erro no processLogin:", err);
    res.status(500).send("Erro interno durante o login.");
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Erro ao fazer logout:", err);
      return res.status(500).send("Erro ao fazer logout.");
    }

    res.redirect("/login");
  });
};
