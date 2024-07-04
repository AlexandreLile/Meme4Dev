import fs from 'fs';
import path from 'path';

const memesFilePath = path.resolve('memes.json');

function readMemesFromFile() {
  try {
    const data = fs.readFileSync(memesFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erreur lors de la lecture du fichier memes.json:', error);
    return [];
  }
}

function writeMemesToFile(memes) {
  try {
    fs.writeFileSync(memesFilePath, JSON.stringify(memes, null, 2));
  } catch (error) {
    console.error('Erreur lors de l\'écriture du fichier memes.json:', error);
  }
}

function getAllMemes() {
  return readMemesFromFile();
}

function getMemeById(id) {
  const memes = readMemesFromFile();
  return memes.find(meme => meme.id === id);
}

function addMeme(title, imageUrl) {
  const memes = readMemesFromFile();
  const id = memes.length ? memes[memes.length - 1].id + 1 : 1;
  const meme = { id, title, imgUrl: imageUrl };
  memes.push(meme);
  writeMemesToFile(memes);
  return meme;
}


function updateMeme(id, title, imageUrl) {
  const memes = readMemesFromFile();
  const meme = memes.find(meme => meme.id === id);
  if (!meme) return null;
  meme.title = title;
  meme.imageUrl = imageUrl;
  writeMemesToFile(memes);
  return meme;
}

function deleteMeme(id) {
  const memes = readMemesFromFile();
  const index = memes.findIndex(meme => meme.id === id);
  if (index === -1) return null;
  const deletedMeme = memes.splice(index, 1)[0];
  writeMemesToFile(memes);
  return deletedMeme;
}

export {
  getAllMemes,
  getMemeById,
  addMeme,
  updateMeme,
  deleteMeme
};
