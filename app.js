import express from "express";
import multer from "multer";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;
const KIRI_API_KEY = process.env.KIRI_API_KEY_ARK;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Configuração do multer (upload)
const upload = multer({ dest: "uploads/" });

// Rota de teste
app.get("/", (req, res) => {
  res.send("✅ Ark Scan 3D backend está rodando!");
});

// Rota para conversão de imagem → modelo 3D
app.post("/convert", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "Nenhum arquivo recebido" });

    console.log("📸 Enviando arquivo para KIRI Engine...");

    const fileStream = fs.createReadStream(file.path);
    const response = await fetch("https://www.kiriengine.app/api/convert", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${KIRI_API_KEY}`,
      },
      body: fileStream,
    });

    const result = await response.json();
    console.log("✅ Resposta da KIRI:", result);

    // Deleta o arquivo temporário
    fs.unlinkSync(file.path);

    if (result && result.modelUrl) {
      return res.json({ success: true, modelUrl: result.modelUrl });
    } else {
      return res.status(500).json({ error: "Erro na conversão da KIRI" });
    }
  } catch (err) {
    console.error("❌ Erro na conversão:", err);
    res.status(500).json({ error: "Falha no servidor" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});