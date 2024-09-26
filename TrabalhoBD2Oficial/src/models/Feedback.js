// models/Feedback.js
import { Client } from "../database/connection.js";
import { ObjectId, ReturnDocument } from "mongodb";

class Feedback {
  constructor(loja, produto, titulo, descricao, midia, curtidas, id_usuario) {
    this.loja = loja;
    this.produto = produto;
    this.titulo = titulo;
    this.descricao = descricao;
    this.midia = midia; // Armazena a mídia (array com URL e tipo)
    this.curtidas = curtidas || 0;
    this.id_usuario = id_usuario;
  }

  static async getAllFeedback() {
    const db = Client.db("TrabalhoBD2");
    const feedback = await db
      .collection("Feedback")
      .aggregate([
        {
          $addFields: {
            id_usuario_obj: { $toObjectId: "$id_usuario" },
          },
        },
        {
          $lookup: {
            from: "Usuários",
            localField: "id_usuario_obj",
            foreignField: "_id",
            as: "usuario",
          },
        },
        {
          $unwind: "$usuario",
        },
      ])
      .toArray();

    return feedback;
  }

  static async getFeedbackUsuario(id_usuario) {
    const db = Client.db("TrabalhoBD2");

    const feedbackUsuario = await db
      .collection("Feedback")
      .find({ id_usuario })
      .toArray();
    return feedbackUsuario;
  }

  static async getOneFeedback(filters) {
    const db = Client.db("TrabalhoBD2");

    const feedback = await db.collection("Feedback").find(filters).toArray();
    return feedback;
  }

  async newFeedBack() {
    const db = Client.db("TrabalhoBD2");

    const createFeedback = await db.collection("Feedback").insertOne({
      loja: this.loja,
      produto: this.produto,
      titulo: this.titulo,
      descricao: this.descricao,
      midia: this.midia,
      curtidas: this.curtidas,
      id_usuario: this.id_usuario,
      createdAt: new Date(),
    });
    return createFeedback;
  }

  static async updateFeedback(feedbackId, updatefeedback) {
    const db = Client.db("TrabalhoBD2");

    const id = new ObjectId(feedbackId);

    // Atualiza o feedback no banco de dados
    const updateFeedback = await db
      .collection("Feedback")
      .updateOne({ _id: id }, { $set: updatefeedback });
    return updateFeedback;
  }

  static async deleteFeedback(idFeedback) {
    const db = Client.db("TrabalhoBD2");
    console.log(idFeedback);

    const id = new ObjectId(idFeedback);
    const deleteFeedback = await db
      .collection("Feedback")
      .deleteOne({ _id: id });
    return deleteFeedback;
  }

  // **Método Atualizado para Incrementar Curtidas com Tratamento de Erros**
  static async incrementLikes(feedbackId) {
    const db = Client.db("TrabalhoBD2");
    let id;

    // Validação do ObjectId
    try {
      id = new ObjectId(feedbackId);
    } catch (error) {
      console.error(`Invalid ObjectId: ${feedbackId}`, error);
      return null;
    }

    try {
      const exists = await db.collection("Feedback").findOne({ _id: id });
      if (!exists) {
        console.error(`Feedback not found with ID: ${feedbackId}`);
        return null;
      }

      const updatedFeedback = await db
        .collection("Feedback")
        .findOneAndUpdate(
          { _id: id },
          { $inc: { curtidas: 1 } },
          { returnDocument: ReturnDocument.AFTER }
        );

      return updatedFeedback;
    } catch (error) {
      console.error(
        `Error incrementing likes for feedback ID ${feedbackId}:`,
        error
      );
      return null;
    }
  }
}

export default Feedback;
