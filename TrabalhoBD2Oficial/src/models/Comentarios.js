// models/Comentarios.js

import { Client } from "../database/connection.js";
import { ObjectId } from "mongodb";

class Comentarios {
  constructor(id_usuario, id_feedback, texto) {
    this.id_usuario = id_usuario;
    this.id_feedback = id_feedback;
    this.texto = texto;
    this.createdAt = new Date();
  }
  async newComments() {
    const db = Client.db("TrabalhoBD2");
    const comentario = await db.collection("Comentarios").insertOne({
      id_usuario: new ObjectId(this.id_usuario),
      id_feedback: new ObjectId(this.id_feedback),
      texto: this.texto,
      createdAt: this.createdAt,
    });
    return comentario;
  }

  // Obter comentários por feedback
  static async getComentarioFeedback(feedbackId) {
    const db = Client.db("TrabalhoBD2");
    const comentarios = await db
      .collection("Comentarios")
      .find({ id_feedback: new ObjectId(feedbackId) })
      .sort({ createdAt: -1 })
      .toArray();
    return comentarios;
  }

  // Obter comentário por ID
  static async getComentarioById(comentarioId) {
    const db = Client.db("TrabalhoBD2");
    const comentario = await db
      .collection("Comentarios")
      .findOne({ _id: new ObjectId(comentarioId) });
    return comentario;
  }

  // Atualizar um comentário
  static async updateComentario(comentarioId, updateData) {
    const db = Client.db("TrabalhoBD2");
    const updateResult = await db
      .collection("Comentarios")
      .updateOne({ _id: new ObjectId(comentarioId) }, { $set: updateData });
    return updateResult;
  }

  // Deletar um comentário
  static async deleteComments(comentarioId) {
    const db = Client.db("TrabalhoBD2");
    const deleteResult = await db
      .collection("Comentarios")
      .deleteOne({ _id: new ObjectId(comentarioId) });
    return deleteResult;
  }
}

export default Comentarios;
