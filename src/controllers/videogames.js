const { Videogames, Favorites } = require("../db.js");
const { Op } = require("sequelize");
const fetch = require("node-fetch");

async function fetchApiVideogames(page) {
  return await fetch(
    `https://api.rawg.io/api/games?key=${process.env.API_KEY}&page=${page}`,
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
  return await Videogames.findAll()
    .then(async (videogames) => {
      let values = [];
      for (let i = 0; i < videogames.length; i++) {
        const fav = await Favorites.findAll({
          where: {
            id_videogame: videogames[i].dataValues.id,
          },
        });
        values.push({
          videogames: videogames[i],
          fav,
        });
      }
      return values;
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
    .then(async (videogames) => {
      let values = [];
      for (let i = 0; i < videogames.length; i++) {
        const fav = await Favorites.findAll({
          where: {
            id_videogame: videogames[i].dataValues.id,
          },
        });
        values.push({
          videogames: videogames[i],
          fav,
        });
      }
      return values;
    })
    .catch(() => ({
      error: "error al obtener los datos en la base de datos",
    }))
    .finally();
}

async function fetchVideogameApibyName(nombre) {
  if (nombre.length !== 0) {
    return await fetch(
      `https://api.rawg.io/api/games?key=${process.env.API_KEY}&search=${nombre}`,
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
      .then((response) => {
        return {
          ...response,
          results: response.results.slice(0, 15),
        };
      })
      .catch((e) => ({
        error: e.message,
      }))
      .finally();
  } else {
    return undefined;
  }
}

async function fetchVideogameDbbyName(nombre) {
  if (nombre.length !== 0) {
    return await Videogames.findAll(
      {
        where: {
          nombre: {
            [Op.like]: `%${nombre.toLowerCase()}%`,
          },
        },
      },
      { limit: 15 }
    )
      .then(async (videogames) => {
        let values = [];
        for (let i = 0; i < videogames.length; i++) {
          const fav = await Favorites.findAll({
            where: {
              id_videogame: videogames[i].dataValues.id,
            },
          });
          values.push({
            videogames: videogames[i],
            fav,
          });
        }
        return values;
      })
      .catch(() => ({
        error: "error al obtener los datos en la base de datos",
      }));
  } else {
    return undefined;
  }
}

async function createVideoGame(values) {
  const { game, genres } = values;
  return await Videogames.create({ ...game })
    .then(async (res) => {
      const favorites = genres.map((idgenre) => {
        return { id_videogame: res.dataValues.id, id_genres: idgenre };
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
