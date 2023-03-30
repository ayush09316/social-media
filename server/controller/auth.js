import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../mongodb/models/UserModel.js";
import { sendMail } from "../utility/nodeMailer.js";

/* REGISTER USER */
export const register = async (req, res) => {
  try {
    console.log("req", req.body);
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = new UserModel({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    const savedUser = await newUser.save();
    sendMail("register", savedUser);
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: "User does not exist. " });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const forgetPassword = async function forgetpassword(req, res) {
  try {
    let { email } = req.body;
    const user = await UserModel.findOne({ email: email });
    if (user) {
      const resetToken = user.createResetToken();
      let resetPasswordLink = `${req.protocol}://${req.get(
        "host"
      )}/resetpassword/${resetToken}`;
      let obj = {
        resetPasswordLink: resetPasswordLink,
        email: email,
      };
      sendMail("resetpassword", obj);
      res.json({
        message: "link sent",
        data: obj,
      });
    } else {
      return res.json({
        message: "Please sign up",
      });
    }
  } catch (err) {
    return res.json({
      message: err,
    });
  }
};

export const resetPassword = async function resetpassword(req, res) {
  const token = req.params.token;
  console.log(token);
  let { password } = req.body;
  const user = await UserModel.findOne({ resetToken: token });
  if (user) {
    user.resetPasswordHandler(password);
    await user.save();
    res.json({
      message: "password changed successfully",
    });
  } else {
    res.json({
      message: "user not found",
    });
  }
};

export const reset=async function reset(req,res){
  const token = req.params.token;
  res.render('resetpassword')
}