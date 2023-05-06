const { Videogames, Favorites } = require("../db.js");
const fetch = require("node-fetch");

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
  await Videogames.findAll()
    .then((result) => {
      return result;
    })
    .catch(() => ({
      error: "error al obtener los datos en la base de datos",
    }))
    .finally();
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
  return await Videogames.findAll({
    where: {
      id: id,
    },
  })
    .then((result) => {
      return result;
    })
    .catch(() => ({
      error: "error al obtener los datos en la base de datos",
    }))
    .finally();
}

async function fetchVideogameApibyName(nombre) {
  const values = await fetch(
    `https://api.rawg.io/api/games?key=${process.env.API_KEY}&search=${nombre}`,
    {
      method: "GET",
    }
  ).then((response) => response.json());
  try {
    return values.results;
  } catch (e) {
    return { e: "error" };
  }
  // return await fetch(url, { method: "GET" })
  //   .then((response) => {
  //     if (response.ok) {
  //       return response.json();
  //     }
  //     throw new Error(response.statusText);
  //   })
  //   .then((response) => response.results)
  //   .catch((e) => ({
  //     error: e.message,
  //   }))
  //   .finally();
}

async function fetchVideogameDbbyName(nombre) {
  return await Videogames.findAll(
    {
      where: {
        nombre: `${nombre.toLowerCase()}`,
      },
    },
    { limit: 15 }
  )
    .then((result) => {
      return result;
    })
    .catch(() => ({
      error: "error al obtener los datos en la base de datos",
    }))
    .finally();
}

async function createVideoGame(values) {
  const { game, genres } = values;
  return await Videogames.create({ ...game })
    .then(async (res) => {
      const favorites = genres.map((idgenre) => {
        return { id_videogame: game.id, id_genres: idgenre };
      });
      await Favorites.bulkCreate(favorites);
      return {
        game,
        genres,
      };
    })
    .catch(() => ({
      error: "error al obtener los datos en la base de datos",
    }))
    .finally();
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
