import bcrypt from "bcrypt";
import { Client } from "../database/connection.js";
import { ObjectId } from "mongodb";

class Usuario {
  constructor(email, senha, nome) {
    this.email = email;
    this.senha = senha;
    this.nome = nome;
  }

  static async getAllUsers() {
    const db = Client.db("TrabalhoBD2");

    // Busca todos os usuários na coleção 'Usuários'
    const users = await db.collection("Usuários").find({}).toArray();
    return users;
  }

  static async getUser(idUser) {
    const db = Client.db("TrabalhoBD2");
    const id = new ObjectId(idUser);
    const user = await db.collection("Usuários").findOne({ _id: id });
    return user;
  }

  async createUser() {
    const db = Client.db("TrabalhoBD2");

    const hashedPassword = await bcrypt.hash(this.senha, 10);

    const creanewteUser = await db.collection("Usuários").insertOne({
      //insere o email e a senha criptografada no banco
      email: this.email,
      senha: hashedPassword,
      nome: this.nome,
    });
    return creanewteUser;
  }

  static async updateUser(userId, updateUSer) {
    const db = Client.db("TrabalhoBD2");

    if (updateUSer.senha) {
      // Criptografa a nova senha antes de atualizar
      const hashedPassword = await bcrypt.hash(updateUSer.senha, 10);
      updateUSer.senha = hashedPassword;
    }

    const id = new ObjectId(userId);
    const updateUser = await db
      .collection("Usuários")
      .updateOne({ _id: id }, { $set: updateUSer });
    return updateUser;
  }

  static async deleteUser(idUser) {
    const db = Client.db("TrabalhoBD2");

    const id = new ObjectId(idUser);
    const deleteUser = await db.collection("Usuários").deleteOne({ _id: id });
    return deleteUser;
  }
}

export default Usuario;
