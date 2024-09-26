import Feedback from "../models/Feedback.js";
import { ObjectId } from "mongodb";

class ControllerFeedback {
  static async getAllFeedback(req, res) {
    try {
      const feedback = await Feedback.getAllFeedback();
      res.status(200).json(feedback);
    } catch (error) {
      res.status(500).send("Erro ao buscar feedbackses");
    }
  }

  static async getFeedbackUsuario(req, res) {
    const id_usuario = req.params.idUsuario;

    try {
      const feedbackUser = await Feedback.getFeedbackUsuario(id_usuario);
      res.status(200).json(feedbackUser);
    } catch (error) {
      res.status(500).send("Erro ao buscar feedback");
    }
  }

  static async getOneFeedback(req, res) {
    const { ...filters } = req.query;
    try {
      const feedback = await Feedback.getOneFeedback(filters);
      res.status(200).json(feedback);
    } catch (error) {
      res.status(500).send("Feedback não encontrado");
    }
  }

  static async submitFeedback(req, res) {
    try {
      const media = req.files.map((file) => ({
        url: `../uploads/${file.filename}`,
        type: file.mimetype.startsWith("image") ? "photo" : "video",
      }));

      const { loja, produto, titulo, descricao, curtidas, id_usuario } =
        req.body;
      const feedback = new Feedback(
        loja,
        produto,
        titulo,
        descricao,
        media,
        curtidas,
        id_usuario
      );

      const result = await feedback.newFeedBack();
      res
        .status(201)
        .json({ message: "Feedback enviado com sucesso!", result });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erro ao enviar feedback", error: error.message });
    }
  }
  static async updateFeedback(req, res) {
    const idFeedback = req.params.id;
    const { loja, produto, titulo, descricao } = req.body;
    const files = req.files;
    try {
      let newMedia = [];
      if (files && files.length > 0) {
        newMedia = files.map((file) => ({
          url: `/uploads/${file.filename}`,
          type: file.mimetype.startsWith("image") ? "photo" : "video",
        }));
      }
      const updateData = {
        loja,
        produto,
        titulo,
        descricao,
      };
      if (newMedia.length > 0) {
        updateData.midia = newMedia;
      }
      const updateResult = await Feedback.updateFeedback(
        idFeedback,
        updateData
      );
      if (updateResult.matchedCount === 0) {
        return res.status(404).json({ message: "Feedback não encontrado." });
      }
      const updatedFeedback = await Feedback.getOneFeedback({
        _id: new ObjectId(idFeedback),
      });
      res.status(200).json({
        message: "Feedback atualizado com sucesso.",
        result: updatedFeedback[0],
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Erro ao editar feedback");
    }
  }

  static async deleteFeedback(req, res) {
    const idFeedback = req.params.id;

    try {
      const deleteFeedback = await Feedback.deleteFeedback(idFeedback);
      res.status(200).json(deleteFeedback);
    } catch (error) {
      res.status(500).send("Erro ao deletar feedback");
    }
  }

  static async likeFeedback(req, res) {
    const feedbackId = req.params.id;

    try {
      const updatedFeedback = await Feedback.incrementLikes(feedbackId);
      if (!updatedFeedback) {
        return res.status(404).json({ message: "Feedback não encontrado." });
      }

      res.status(200).json(updatedFeedback);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao curtir feedback." });
    }
  }
}

export default ControllerFeedback;
