const {
  fetchApiVideogames,
  fetchDBVideogames,
  fetchApiVideogamesbyid,
  fetchDbVideogamesbyid,
  fetchVideogameApibyName,
  fetchVideogameDbbyName,
  createVideoGame,
} = require("../controllers/videogames");

async function getVideogames(req, res) {
  const { name } = req.query;

  try {
    if (name === undefined) {
      const db = await fetchDBVideogames();
      const api = await fetchApiVideogames();
      res.status(200).json({ api: api, db: db, name });
    } else {
      const db = await fetchVideogameDbbyName(name);
      const api = await fetchVideogameApibyName(name);
      res.status(200).json({
        api: api,
        key: process.env.API_KEY,
        db: db,
        name,
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

async function getVideoGamesbyId(req, res) {
  const { idVideogame } = req.params;
  try {
    const db = await fetchDbVideogamesbyid(idVideogame);
    const api = await fetchApiVideogamesbyid(idVideogame);
    res.status(200).json({ api, db });
  } catch (error) {
    res.status(500).json(error);
  }
}
async function postVideogame(req, res) {
  try {
    const result = await createVideoGame(req.body);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

module.exports = {
  getVideogames,
  getVideoGamesbyId,
  postVideogame,
};
