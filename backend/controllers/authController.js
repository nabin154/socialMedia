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
    res.status(500).json({ message: err.messsage });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "user doesnot exists" });
    }

    const verified = await user.comparePassword(password);
    if (verified) {


      const accessToken = await user.generateToken();
      const refreshToken = await user.generateRefreshToken();

      user.refreshToken = refreshToken;
      await user.save();

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
      });
    } else {
      return res.status(400).json({ message: "invalid credentials" });
    }
  } catch (err) {
    return res.status(504).json({ message: err.message });
  }
};
const getNewAccessToken = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(403).json({ message: 'Refresh token missing' });
  }

  try {
    const decoded = await jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded?._id)

    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh token' });

    }

    if (refreshToken !== user?.refreshToken) {
      return res.status(402).json({ message: ' Used or expired refresh token' });


    }
    const accessToken = await jwt.sign({ _id: decoded._id, email: decoded.email }, process.env.JWT_SECRET, { expiresIn: '2m' }); // Set expiration to 15 minutes
    res.cookie('accessToken', accessToken, { httpOnly: true });
    res.json({ accessToken });
  } catch (error) {
    res.status(403).json({ message: 'Invalid refresh token' });
  }
};

const logoutUser = async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1
      }
    },
    {
      new: true
    }
  );

  res.clearCookie('accessToken', { httpOnly: true });
  res.clearCookie('refreshToken', { httpOnly: true });

  return res.status(200).json("successful  logout !!!");
};

module.exports = { loginUser, registerUser, getNewAccessToken, logoutUser };
