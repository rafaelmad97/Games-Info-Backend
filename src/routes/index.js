const { Router } = require("express");
const {
  getVideogames,
  getVideoGamesbyId,
  postVideogame,
} = require("./videogames");
const { getGenres } = require("./genres");

// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.get("/videogames/:idVideogame", getVideoGamesbyId);
router.get("/videogames/", getVideogames);
router.post("/videogames", postVideogame);
router.get("/genres/", getGenres);
module.exports = router;
