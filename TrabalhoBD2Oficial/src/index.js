import express from "express";
import { connection } from "./database/connection.js";
import routes from "./routes/Routes.js";
import cors from "cors";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());

const PORT = process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadsDir = path.join(__dirname, "..", "uploads");

// Verificar e criar a pasta 'uploads' se não existir
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log(`Pasta 'uploads' criada em: ${uploadsDir}`);
} else {
  console.log(`Pasta 'uploads' já existe em: ${uploadsDir}`);
}
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use(express.json());
app.use(routes);

app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.resolve("uploads")));

connection().catch(console.error);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
