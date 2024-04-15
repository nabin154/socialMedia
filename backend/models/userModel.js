const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    picturePath: { type: String, default: " " },
    friendRequest: {

      sent: [{ type: String, default: [] }],
      received: [{ type: String, default: [] }],

    },
    friends: { type: Array, default: [] },
    location: { type: String },
    occupation: { type: String },
    viewedProfile: Number,
    impressions: Number,
    refreshToken: { type: String },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) {
    next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
  } catch (err) {
    next(err);
  }
});

userSchema.methods.generateToken = async function () {
  try {
    return jwt.sign(
      {
        _id: this._id,
        email: this.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15s",
      }
    );
  } catch (err) {
    console.error(err);
  }
};

userSchema.methods.generateRefreshToken = async function () {
  try {
    return jwt.sign(
      {
        _id: this._id,
        email: this.email,
      },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: '30d',
      }
    );
  } catch (error) {
    console.error(err);

  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;
