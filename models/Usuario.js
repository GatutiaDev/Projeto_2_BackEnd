const { connect } = require("./db");
const Logger = require("./logger");
const bcrypt = require("bcryptjs");

class Usuario {
  constructor(nome, senha) {
    this.nome = nome;
    this.senha = senha;
  }

  async inserir() {
    let client;
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.senha, salt);
      const conn = await connect();
      client = conn.client;
      const db = conn.db;
      const result = await db.collection("usuarios").insertOne({
        nome: this.nome,
        senha: hashedPassword,
      });
      Logger.log(`Usuário inserido com sucesso: ${result.insertedId}`);
      return result;
    } catch (error) {
      Logger.log("Erro ao inserir usuário: " + error);
      return null;
    } finally {
      if (client) await client.close();
    }
  }

  static async buscar(filtro = {}) {
    let client;
    try {
      const conn = await connect();
      client = conn.client;
      const db = conn.db;
      const usuarios = await db.collection("usuarios").find(filtro).toArray();
      Logger.log(`${usuarios.length} usuários encontrados!`);
      return usuarios;
    } catch (error) {
      Logger.log("Erro ao buscar usuários: " + error);
      return null;
    } finally {
      if (client) await client.close();
    }
  }

  static async validarLogin(nome, senha) {
    try {
      const usuarios = await this.buscar({ nome: nome });

      if (!usuarios || usuarios.length !== 1) {
        Logger.log(
          `Tentativa de login falhou para "${nome}": usuário não encontrado.`
        );
        return null;
      }
      const usuario = usuarios[0];
      const isMatch = await bcrypt.compare(senha, usuario.senha);

      if (isMatch) {
        Logger.log(`Login bem-sucedido para "${nome}".`);
        const { senha, ...usuarioSemSenha } = usuario;
        return usuarioSemSenha;
      } else {
        Logger.log(
          `Tentativa de login falhou para "${nome}": senha incorreta.`
        );
        return null;
      }
    } catch (error) {
      Logger.log("Erro durante a validação do login: " + error);
      return null;
    }
  }
}

module.exports = Usuario;
