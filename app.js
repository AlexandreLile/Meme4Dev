import express from 'express';
import cors from 'cors';
import multer from 'multer';
import jimp from 'jimp';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { getAllMemes, getMemeById, addMeme, updateMeme, deleteMeme } from './meme.js';


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/public', express.static(path.join(__dirname, 'public')));
const hostname = '127.0.0.1';
const port = process.env.PORT || 3000;

app.listen(port, hostname, () => {
  console.log(`Serveur démarré sur http://${hostname}:${port}`);
});

app.get('/api/memes', (req, res) => {
  try {
    const memes = getAllMemes();
    res.json(memes);
  } catch (error) {
    console.error('Erreur lors de la récupération des memes:', error);
    res.status(500).send('Erreur serveur');
  }
});

app.get('/api/memes/:id', (req, res) => {
  try {
    const meme = getMemeById(parseInt(req.params.id, 10));
    if (meme) {
      res.json(meme);
    } else {
      res.status(404).send('Meme non trouvé');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du meme:', error);
    res.status(500).send('Erreur serveur');
  }
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post('/api/memes', upload.single('image'), async (req, res) => {
  try {
    const { topText, middleText, bottomText, title } = req.body;
    const image = await jimp.read(req.file.buffer);

    const font = await jimp.loadFont(jimp.FONT_SANS_32_WHITE);

    if (topText) {
      image.print(font, 10, 10, {
        text: topText,
        alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: jimp.VERTICAL_ALIGN_TOP,
      }, image.bitmap.width, image.bitmap.height);
    }

    if (middleText) {
      image.print(font, 10, image.bitmap.height / 2 - 16, {
        text: middleText,
        alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: jimp.VERTICAL_ALIGN_MIDDLE,
      }, image.bitmap.width, image.bitmap.height);
    }

    if (bottomText) {
      image.print(font, 10, image.bitmap.height - 50, {
        text: bottomText,
        alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: jimp.VERTICAL_ALIGN_BOTTOM,
      }, image.bitmap.width, image.bitmap.height);
    }

    const memeFileName = `meme-${Date.now()}.png`;
    const memePath = path.join(__dirname, 'public/images', memeFileName);
    await image.writeAsync(memePath);

    const newMeme = addMeme(title, `/public/images/${memeFileName}`);
    res.status(201).json(newMeme);
  } catch (error) {
    console.error('Erreur lors de l\'ajout du meme:', error);
    res.status(500).send('Erreur serveur');
  }
});


app.put('/api/memes/:id', (req, res) => {
  try {
    const updatedMeme = updateMeme(parseInt(req.params.id, 10), req.body);
    if (updatedMeme) {
      res.json(updatedMeme);
    } else {
      res.status(404).send('Meme non trouvé');
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du meme:', error);
    res.status(500).send('Erreur serveur');
  }
});

app.delete('/api/memes/:id', (req, res) => {
  try {
    const deletedMeme = deleteMeme(parseInt(req.params.id, 10));
    if (deletedMeme) {
      res.json(deletedMeme);
    } else {
      res.status(404).send('Meme non trouvé');
    }
  } catch (error) {
    console.error('Erreur lors de la suppression du meme:', error);
    res.status(500).send('Erreur serveur');
  }
});

app.post('/api/authenticate', (req, res) => {
  const password = req.body.password;
  const correctPassword = process.env.PASSWORD;

  console.log('Mot de passe saisi :', password);
  console.log('Mot de passe attendu :', correctPassword);

  if (password === correctPassword) {
    res.send(true);
  } else {
    res.status(401).send(false);
  }
});