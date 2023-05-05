const { Videogames, Favorites } = require("../db.js");

async function fetchApiVideogames() {
  const values = await fetch(
    `https://api.rawg.io/api/games?key=${process.env.API_KEY}`,
    {
      method: "GET",
    }
  )
    .then((response) => response.json())
    .catch((error) => {
      throw new Error(error.message);
    })
    .finally();
  return values.results;
}

async function fetchDBVideogames() {
  try {
    const videogames = await Videogames.findAll();
    return videogames;
  } catch (exception) {
    throw new Error(exception);
  }
}

async function fetchApiVideogamesbyid(id) {
  const values = await fetch(
    `https://api.rawg.io/api/games/${id}?key=${process.env.API_KEY}`,
    {
      method: "GET",
    }
  )
    .then((response) => response.json())
    .catch((error) => {
      throw new Error(error.message);
    })
    .finally();

  return values;
}

async function fetchDbVideogamesbyid(id) {
  try {
    const videogame = await Videogames.findAll({
      where: {
        id: id,
      },
    });
    return videogame;
  } catch (exception) {
    throw Error(exception);
  }
}

async function fetchVideogameApibyName(nombre) {
  const values = await fetch(
    `https://api.rawg.io/api/games?key=${
      process.env.API_KEY
    }&search=${nombre.toLowerCase()}`
  )
    .then((response) => response.json())
    .catch((error) => {
      throw Error(error);
    });
  console.log(values.results.slice(0, 15).length);
  return values.results.slice(0, 15);
}

async function fetchVideogameDbbyName(nombre) {
  try {
    const videogame = await Videogames.findAll(
      {
        where: {
          nombre: `${nombre.toLowerCase()}`,
        },
      },
      { limit: 15 }
    );
    return videogame;
  } catch (exception) {
    throw Error(exception);
  }
}

async function createVideoGame(values) {
  try {
    const { game, genres } = values;
    await Videogames.create({ ...game });
    const favorites = genres.map((idgenre) => {
      return { id_videogame: game.id, id_genres: idgenre };
    });
    await Favorites.bulkCreate(favorites);
    return values;
  } catch (e) {
    throw Error(e.message);
  }
}

module.exports = {
  fetchApiVideogames,
  fetchDBVideogames,
  fetchApiVideogamesbyid,
  fetchDbVideogamesbyid,
  fetchVideogameApibyName,
  fetchVideogameDbbyName,
  createVideoGame,
};
