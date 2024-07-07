import express from "express";
import cors from "cors";
import multer from "multer";
import jimp from "jimp";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import {
  getAllMemes,
  getMemeById,
  addMeme,
  updateMeme,
  deleteMeme,
} from "./meme.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/public", express.static(path.join(__dirname, "public")));
const hostname = "127.0.0.1";
const port = process.env.PORT || 3000;

app.listen(port, hostname, () => {
  console.log(`Serveur démarré sur http://${hostname}:${port}`);
});

app.get("/api/memes", (req, res) => {
  try {
    const memes = getAllMemes();
    res.json(memes);
  } catch (error) {
    console.error("Erreur lors de la récupération des memes:", error);
    res.status(500).send("Erreur serveur");
  }
});

app.get("/api/memes/:id", (req, res) => {
  try {
    const meme = getMemeById(parseInt(req.params.id, 10));
    if (meme) {
      res.json(meme);
    } else {
      res.status(404).send("Meme non trouvé");
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du meme:", error);
    res.status(500).send("Erreur serveur");
  }
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post("/api/memes", upload.single("image"), async (req, res) => {
  try {
    const {
      topText,
      middleText,
      bottomText,
      title,
      topTextColor = "#000000",
      middleTextColor = "#000000",
      bottomTextColor = "#000000",
    } = req.body;
    const image = await jimp.read(req.file.buffer);

    const font = await jimp.loadFont(jimp.FONT_SANS_64_WHITE); // Police de base pour la mesure
    image.cover(1080, 1080);

    const printText = async (text, color, alignmentY, offsetY = 0) => {
      if (text) {
        const textImage = new jimp(
          image.bitmap.width,
          image.bitmap.height,
          0x00000000
        );

        textImage.print(
          font,
          0,
          offsetY,
          {
            text: text,
            alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY: alignmentY,
          },
          image.bitmap.width,
          image.bitmap.height
        );

        const hexColor = jimp.cssColorToHex(color);
        textImage.scan(
          0,
          0,
          textImage.bitmap.width,
          textImage.bitmap.height,
          function (x, y, idx) {
            const red = this.bitmap.data[idx + 0];
            const green = this.bitmap.data[idx + 1];
            const blue = this.bitmap.data[idx + 2];
            if (red === 255 && green === 255 && blue === 255) {
              this.bitmap.data[idx + 0] = (hexColor >> 24) & 0xff;
              this.bitmap.data[idx + 1] = (hexColor >> 16) & 0xff;
              this.bitmap.data[idx + 2] = (hexColor >> 8) & 0xff;
            }
          }
        );

        image.composite(textImage, 0, 0, {
          mode: jimp.BLEND_SOURCE_OVER,
          opacitySource: 1,
          opacityDest: 1,
        });
      }
    };

    await printText(topText, topTextColor, jimp.VERTICAL_ALIGN_TOP, 10);
    await printText(middleText, middleTextColor, jimp.VERTICAL_ALIGN_MIDDLE);
    await printText(
      bottomText,
      bottomTextColor,
      jimp.VERTICAL_ALIGN_BOTTOM,
      -20
    );

    const memeFileName = `meme-${Date.now()}.png`;
    const memePath = path.join(__dirname, "public/images", memeFileName);
    await image.writeAsync(memePath);

    const newMeme = addMeme(title, `/public/images/${memeFileName}`);
    res.status(201).json(newMeme);
  } catch (error) {
    console.error("Erreur lors de l'ajout du meme:", error);
    res.status(500).send("Erreur serveur");
  }
});

app.put("/api/memes/:id", (req, res) => {
  try {
    const updatedMeme = updateMeme(parseInt(req.params.id, 10), req.body);
    if (updatedMeme) {
      res.json(updatedMeme);
    } else {
      res.status(404).send("Meme non trouvé");
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour du meme:", error);
    res.status(500).send("Erreur serveur");
  }
});


app.delete("/api/memes/:id", (req, res) => {
  try {
    const memeId = parseInt(req.params.id, 10);
    const deletedMeme = deleteMeme(memeId);

    if (deletedMeme) {
      const memePath = path.join(__dirname, deletedMeme.imgUrl);
      fs.unlink(memePath, (err) => {
        if (err) {
          console.error("Erreur lors de la suppression du fichier:", err);
          return res
            .status(500)
            .send("Erreur serveur lors de la suppression du fichier");
        }
        res.json(deletedMeme);
      });
    } else {
      res.status(404).send("Meme non trouvé");
    }
  } catch (error) {
    console.error("Erreur lors de la suppression du meme:", error);
    res.status(500).send("Erreur serveur");
  }
});

app.post("/api/authenticate", (req, res) => {
  const password = req.body.password;
  const correctPassword = process.env.PASSWORD;

  console.log("Mot de passe saisi :", password);
  console.log("Mot de passe attendu :", correctPassword);

  if (password === correctPassword) {
    res.send(true);
  } else {
    res.status(401).send(false);
  }
});
