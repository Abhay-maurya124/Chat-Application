import { redisClient } from "../index.js";
import { publishToQueue } from "../config/rabbitmq.js";
import tryCatch from "../config/tryCatch.js";
import { User } from "../model/User.js";
import { GenToken } from "../config/GenToken.js";

export const login = tryCatch(async (req, res) => {
  const { email } = req.body;
  const rateLimitkey = `OTP:ratelimit:${email}`;
  const ratelimit = await redisClient.get(rateLimitkey);
  if (ratelimit) {
    res.status(429).json({
      message: "Too many requests.Plase wait before requesting new OTP",
    });
    return;
  }
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpkey = `OTP :${email}`;
  await redisClient.set(otpkey, otp, {
    EX: 300,
  });
  await redisClient.set(rateLimitkey, "true", {
    EX: 600,
  });
  const massege = {
    to: email,
    subject: "your OTP code",
    body: `your OTP is ${otp}.it is valid for 5 minutes`,
  };

  await publishToQueue("send-otp", massege);
  res.status(200).json({
    success: true,
    message: "Otp sent to your mail",
  });
});

export const verifyemail = tryCatch(async (req, res) => {
  const { email, otp: enteredOtp } = req.body;
  if (!email || !enteredOtp) {
    return res.status(400).json({
      success: false,
      message: "All feilds are required",
    });
  }
  const otpKey = `OTP :${email}`;
  const storedOtp = await redisClient.get(otpKey);
  if (storedOtp !== enteredOtp) {
    return res.status(400).json({
      success: false,
      message: "invelid otp",
    });
  }
  let user = await User.findOne({ email });
  if (!user) {
    const name = email.slice(0, 8);
    user = await User.create({ name, email });
  }
  const Token = GenToken(user);
  await redisClient.del(otpKey);
  res.status(200).json({
    message: "User verified",
    user,
    Token,
  });
});

export const getProfile = tryCatch(async (req, res) => {
  const user = req.user;
  return res.json(user);
});

export const updateprofile = tryCatch(async (req,res) => {
  const { updatedname, updatedphone } = req.body;
  const userId = req.user._id;
  const user = await User.findByIdAndUpdate(userId, {
    name: updatedname,
    phone: updatedphone,
  },{
    new:true
  });
   if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
    res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user,
  });
});
