const { response } = require("express");
const { Genres } = require("../db.js");

async function fetchGenres() {
  try {
    const db = await Genres.findAll();
    await fetch(`https://api.rawg.io/api/genres?key=${process.env.API_KEY}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((response) => {
        if (db.length === 0) {
          const values = response.results.map(({ name }, index) => {
            return { id: index, name };
          });
          initGenres(values);
        }
      })
      .finally();
    return await Genres.findAll();
  } catch (error) {
    throw Error("Error");
  }
}

async function initGenres(apigenres) {
  await Genres.bulkCreate(apigenres);
}

module.exports = {
  fetchGenres,
};
