const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const {
    firstName,
    lastName,
    location,
    occupation,
    email,
    password,
    picturePath,
    friends,
  } = req.body;
  try {
    const newUser = new User({
      firstName,
      lastName,
      location,
      occupation,
      email,
      password,
      picturePath,
      friends,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    newUser.refreshToken = await newUser.generateRefreshToken();
    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.messsage });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "user doesnot exists" });
    }

    const verified = await user.comparePassword(password);
    if (verified) {
      
  
      const accessToken = await user.generateToken();
      const refreshToken = await user.generateRefreshToken();

      res.cookie('accessToken', accessToken, { httpOnly: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true });

      return res.status(200).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        location: user.location,
        occupation: user.occupation,
        email: user.email,
        picturePath: user.picturePath,
        friendRequest: user.friendRequest,
        friends: user.friends,
        viewedProfile: user.viewedProfile,
        impressions: user.impressions,
        token: await user.generateToken(),
      });
    } else {
      return res.status(400).json({ msg: "invalid credentials" });
    }
  } catch (err) {
    return res.status(504).json({ msg: err.message });
  }
};
const getNewAccessToken = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  console.log(refreshToken);
 
  if (!refreshToken) {
      return res.status(403).json({ message: 'Refresh token missing' });
  }
  
  try {
    const decoded = await jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const accessToken = await jwt.sign({ _id: decoded._id, email: decoded.email }, process.env.JWT_SECRET, { expiresIn: '15s' }); // Set expiration to 15 minutes
      res.cookie('accessToken', accessToken, { httpOnly: true });
      res.json({ accessToken });
  } catch (error) {
      res.status(403).json({ message: 'Invalid refresh token' });
  }
};

module.exports = { loginUser, registerUser ,getNewAccessToken};
