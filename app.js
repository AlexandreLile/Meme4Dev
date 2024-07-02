import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getAllMemes, getMemeById, addMeme, updateMeme, deleteMeme } from './meme.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

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

app.post('/api/memes', (req, res) => {
  try {
    const newMeme = addMeme(req.body);
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
