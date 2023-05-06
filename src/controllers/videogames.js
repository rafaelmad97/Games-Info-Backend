const { Videogames, Favorites } = require("../db.js");
function fetchApiVideogames() {
  return fetch(`https://api.rawg.io/api/games?key=${process.env.API_KEY}`, {
    method: "GET",
  })
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

function fetchDBVideogames() {
  Videogames.findAll()
    .then((result) => {
      return result;
    })
    .catch(() => ({
      error: "error al obtener los datos en la base de datos",
    }))
    .finally();
}

function fetchApiVideogamesbyid(id) {
  return fetch(
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

function fetchDbVideogamesbyid(id) {
  return Videogames.findAll({
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

function fetchVideogameApibyName(nombre) {
  const url =
    "https://api.rawg.io/api/games?key=" +
    process.env.API_KEY +
    "&search=" +
    nombre.toLowerCase();
  console.log("init fetch", url);
  return fetch("https://api.github.com/users/xiaotian/repos")
    .then(
      (resp) => resp.json() // this returns a promise
    )
    .then((repos) => {
      for (const repo of repos) {
        console.log(repo.name);
      }
    })
    .catch((ex) => {
      console.error(ex);
    });
}

function fetchVideogameDbbyName(nombre) {
  return Videogames.findAll(
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

function createVideoGame(values) {
  const { game, genres } = values;
  return Videogames.create({ ...game })
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
