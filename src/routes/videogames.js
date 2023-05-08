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

  if (name === undefined) {
    const database = await fetchDBVideogames();
    const api = [];
    for (let i = 0; i < 5; i++) {
      const response = await fetchApiVideogames(i + 1);
      api.push(response);
    }

    res.status(200).json({ database, api: api.flat(Infinity) });
  } else {
    const db = await fetchVideogameDbbyName(name);
    const api = await fetchVideogameApibyName(name);

    return res.status(200).json({ api: api, db: db, name });
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
