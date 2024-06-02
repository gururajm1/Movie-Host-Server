const User = require("../models/userModel");

module.exports.getLikedMovies = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    if (user) {
      return res.json({ msg: "success", movies: user.likedMovies });
    } else return res.json({ msg: "User not found." });
  } catch (error) {
    return res.json({ msg: "Error fetching movies." });
  }
};

module.exports.addToLikedMovies = async (req, res) => {
  try {
    const { email, data } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const { likedMovies } = user;
      const movieExists = likedMovies.find(({ id }) => id === data.id);
      if (!movieExists) {
        await User.findByIdAndUpdate(
          user._id,
          {
            likedMovies: [...user.likedMovies, data],
          },
          { new: true }
        );
      } else return res.json({ msg: "Movie already added." });
    } else await User.create({ email, likedMovies: [data] });
    return res.json({ msg: "Movie added successfully." });
  } catch (error) {
    return res.json({ msg: "Error adding movie." });
  }
};

module.exports.removeFromLikedMovies = async (req, res) => {
  try {
    const { email, movieId } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const movies = user.likedMovies;
      const movieIndex = movies.findIndex(({ id }) => id === movieId);
      if (movieIndex === -1) {
        return res.status(400).send({ msg: "Movie not found." });
      }
      const updatedMovies = movies.filter(({ id }) => id !== movieId);
      await User.findByIdAndUpdate(
        user._id,
        {
          likedMovies: updatedMovies,
        },
        { new: true }
      );
      return res.json({
        msg: "Movie removed successfully.",
        movies: updatedMovies,
      });
    } else return res.json({ msg: "User not found." });
  } catch (error) {
    return res.json({ msg: "Error removing movie." });
  }
};