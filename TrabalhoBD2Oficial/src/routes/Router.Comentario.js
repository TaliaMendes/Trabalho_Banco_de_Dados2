// Router.Comentario.js

import express from "express";
import ControllerComments from "../controller/ControllerComentarios.js";
import { checkToken } from "../middlewares/Authenticate.middlewares.js";

const routes = express.Router();

// Rotas para comentários

// Obter todos os comentários para um feedback específico
// GET /api/comentarios/:feedbackId/comentarios
routes.get("/:feedbackId/comentarios", ControllerComments.getComments);

// Adicionar um novo comentário a um feedback específico
// POST /api/comentarios/:feedbackId
routes.post(
  "/comentarios/:feedbackId",
  checkToken,
  ControllerComments.newComments
);

// Atualizar um comentário específico
// PUT /api/comentarios/:comentarioId
routes.put("/:comentarioId", checkToken, ControllerComments.updateComments);

// Deletar um comentário específico
// DELETE /api/comentarios/:comentarioId
routes.delete(
  "/comentarios/:comentarioId",
  checkToken,
  ControllerComments.deleteComments
);

export default routes;
