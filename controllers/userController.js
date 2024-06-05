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

module.exports.publicGetLikedMovies = async (req, res) => {
  try {
    const { uuid } = req.params;
    const playlist = await User.findOne({ uuid });
    if (!playlist) {
      return res.json({ msg: "No Playlist Found" });
    } else {
      const isPublic = await playlist.public;
      if (!isPublic) {
        return res.json({ msg: "Playlist is Private" });
      }
      const email = playlist.email;
      console.log(playlist.likedMovies);
      return res.json({ msg: "success", email, movies: playlist.likedMovies });
    }
  } catch (error) {
    return res.json({ msg: "Error fetching movies." });
  }
};

module.exports.checkAndGenerateUUID = async (req, res) => {
  try {
    const { email } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      if (!user.uuid) {
        user.uuid = uuidv4();
        user.public = false;
        await user.save();
      }
      return res.json({ msg: "success", uuid: user.uuid });
    } else {
      return res.json({ msg: "User not found." });
    }
  } catch (error) {
    console.error("Error generating UUID:", error);
    return res.json({ msg: "Error generating UUID." });
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