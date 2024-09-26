import express from "express";
import ControllerFeedback from "../controller/ControllerFeedback.js";
import upload from "../middlewares/MulterConfig.js";

const routes = express.Router();

routes.get("/home", ControllerFeedback.getAllFeedback);
routes.get("/home", ControllerFeedback.getOneFeedback);
routes.get("/meus-feedbacks/:idUsuario", ControllerFeedback.getFeedbackUsuario);
routes.post(
  "/addfeedback",
  upload.array("media", 5),
  ControllerFeedback.submitFeedback
);
routes.put(
  "/atualizar/:id",
  upload.array("media", 5),
  ControllerFeedback.updateFeedback
);

routes.delete("/delete/:id", ControllerFeedback.deleteFeedback);
routes.post("/likefeedbacks/:id/like", ControllerFeedback.likeFeedback);

export default routes;
