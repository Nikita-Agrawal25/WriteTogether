const User = require("../models/User");
const { oauth2client } = require("../utils/googleClient");
const axios = require("axios");
const jwt = require("jsonwebtoken");

// Get Google authentication API
const googleAuth = async (req, res) => {
  try {
    const { code } = req.query;

    // Get access and refresh tokens
    const { tokens } = await oauth2client.getToken(code);
    oauth2client.setCredentials(tokens);

    // Get user profile info from Google
    const userResponse = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`
    );

    const {email, name, picture} = userResponse.data;

    // Save or find user in DB
    let user = await User.findOne({email});

    if (!user) {
      user = await User.create({
        name,
        email,
        image: picture,
      });
    }

    const {_id} = user;

    // Create our own JWT token
    const token = jwt.sign({ _id, email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_TIMEOUT,
    });
    

    res.status(200).json({
      message: "success",
      token,
      user,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    });
  } catch (e) {
    console.error("Google Auth Error:", e);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = googleAuth;