const express = require("express");
const router = require("express").Router();
const User = require("../models/userModel");
const {
  addToLikedMovies,
  getLikedMovies,
  removeFromLikedMovies,
  checkAndGenerateUUID,
  publicGetLikedMovies,
} = require("../controllers/userController");

router.get("/liked/:email", getLikedMovies);
router.post("/check-uuid", checkAndGenerateUUID);
router.post("/add", addToLikedMovies);
router.put("/remove", removeFromLikedMovies);
router.get("/public/liked/:uuid", publicGetLikedMovies);
module.exports = router;

router.post("/make-public", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOneAndUpdate(
      { email },
      { public: true },
      { new: true }
    );
    if (user) {
      return res.json({ msg: "Playlist is now public.", user });
    } else {
      return res.status(404).json({ msg: "User not found." });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Error updating public status." });
  }
});

router.post("/make-private", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOneAndUpdate(
      { email },
      { public: false },
      { new: true }
    );
    if (user) {
      return res.json({ msg: "Playlist is now private.", user });
    } else {
      return res.status(404).json({ msg: "User not found." });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Error updating public status." });
  }
});

module.exports = router;