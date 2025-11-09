import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Corrige dirname em ambiente ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Diretório onde salvar os arquivos (dentro de /public/uploads)
const uploadDir = path.join(__dirname, "../public/uploads");

// Garante que exista
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Configuração do Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});

const upload = multer({ storage });

// Precisamos criar um “handler” compatível com Vercel
export const config = {
  api: {
    bodyParser: false, // Multer precisa desativar o bodyParser padrão
  },
};

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  upload.array("files")(req, res, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao fazer upload" });
    }

    // Gera URLs públicas dos arquivos
    const fileUrls = req.files.map((f) => `/uploads/${f.filename}`);
    res.status(200).json({ files: fileUrls });
  });
}
