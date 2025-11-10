import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mensagem de status
app.get("/", (req, res) => {
  res.send("✅ Ark Scan 3D backend ativo e pronto!");
});

// Rota de conversão via KIRI Engine
app.post("/convert", async (req, res) => {
  try {
    const { type, files } = req.body; // type = "object" ou "place"
    if (!files || files.length === 0) {
      return res.status(400).json({ error: "Nenhum arquivo recebido." });
    }

    const KIRI_API_KEY = process.env.KIRI_API_KEY;
    const apiUrl = "https://api.kiriengine.app/v1/scan";

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${KIRI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode: type === "place" ? "environment" : "object",
        files,
      }),
    });

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error("Erro na conversão:", error);
    res.status(500).json({ error: "Erro ao converter com a KIRI Engine." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
