const { Videogames, Favorites } = require("../db.js");

async function fetchApiVideogames() {
  return await fetch(
    `https://api.rawg.io/api/games?key=${process.env.API_KEY}`,
    {
      method: "GET",
    }
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((response) => response.results)
    .catch((e) => ({
      error: e.message,
    }))
    .finally();
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
  return await fetch(
    `https://api.rawg.io/api/games/${id}?key=${process.env.API_KEY}`,
    {
      method: "GET",
    }
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((response) => response)
    .catch((e) => ({
      error: e.message,
    }))
    .finally();
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
  return await fetch(
    `https://api.rawg.io/api/games?key=${
      process.env.API_KEY
    }&search=${nombre.toLowerCase()}`
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((response) => response.results.slice(0, 15))
    .catch((e) => ({
      error: e.message,
    }))
    .finally();
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
