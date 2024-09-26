// controller/ControllerComentarios.js

import Comentarios from "../models/Comentarios.js";
import { ObjectId } from "mongodb";

class ControllerComments {
  // Obter comentários para um feedback específico
  static async getComments(req, res) {
    const feedbackId = req.params.feedbackId;
    try {
      const comentarios = await Comentarios.getComentarioFeedback(feedbackId);
      res.status(200).json(comentarios);
    } catch (error) {
      console.error("Erro ao buscar comentários:", error);
      res.status(500).send("Erro ao buscar comentários");
    }
  }

  static async newComments(req, res) {
    const { feedbackId } = req.params;
    const { texto } = req.body;

    const id_usuario = req.user.userId;

    if (!texto || texto.trim() === "") {
      return res
        .status(400)
        .json({ message: "O texto do comentário é obrigatório." });
    }

    try {
      const novoComentario = new Comentarios(id_usuario, feedbackId, texto);
      const comentario = await novoComentario.newComments();
      res
        .status(201)
        .json({ message: "Comentário registrado com sucesso!", comentario });
    } catch (error) {
      console.error("Erro ao registrar comentário:", error);
      res.status(500).send("Erro ao registrar comentário");
    }
  }

  static async updateComments(req, res) {
    const comentarioId = req.params.comentarioId;
    const { texto } = req.body;
    const id_usuario = req.user.userId;

    if (!texto || texto.trim() === "") {
      return res
        .status(400)
        .json({ message: "O texto do comentário é obrigatório." });
    }

    try {
      // Verificar se o comentário existe e se o usuário é o autor
      const comentario = await Comentarios.getComentarioById(comentarioId);
      if (!comentario) {
        return res.status(404).json({ message: "Comentário não encontrado." });
      }

      if (comentario.id_usuario.toString() !== id_usuario) {
        return res.status(403).json({
          message: "Você não tem permissão para editar este comentário.",
        });
      }

      const updateResult = await Comentarios.updateComentario(comentarioId, {
        texto,
      });
      res
        .status(200)
        .json({ message: "Comentário atualizado com sucesso.", updateResult });
    } catch (error) {
      console.error("Erro ao editar comentário:", error);
      res.status(500).send("Erro ao editar comentário");
    }
  }

  // Deletar um comentário específico
  static async deleteComments(req, res) {
    const comentarioId = req.params.comentarioId;
    const id_usuario = req.user.userId;

    try {
      // Verificar se o comentário existe e se o usuário é o autor ou admin
      const comentario = await Comentarios.getComentarioById(comentarioId);

      console.log(comentario, id_usuario);
      if (!comentario) {
        return res.status(404).json({ message: "Comentário não encontrado." });
      }

      if (comentario.id_usuario.toString() !== id_usuario) {
        return res.status(403).json({
          message: "Você não tem permissão para deletar este comentário.",
        });
      }

      const deleteResult = await Comentarios.deleteComments(comentarioId);
      res
        .status(200)
        .json({ message: "Comentário deletado com sucesso.", deleteResult });
    } catch (error) {
      console.error("Erro ao deletar comentário:", error);
      res.status(500).send("Erro ao deletar comentário");
    }
  }
}

export default ControllerComments;
