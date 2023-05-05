const { fetchGenres } = require("../controllers/genres");

async function getGenres(req, res) {
  try {
    const genres = await fetchGenres();
    res.status(200).json({ okay: true, genres });
  } catch (e) {
    res.status(200).json({ ohnow: true });
  }
}

module.exports = {
  getGenres,
};
