import mongoose from 'mongoose';
import dotenv from 'dotenv';
import user from '../models/users.js';
import bcrypt from 'bcrypt';
dotenv.config();
mongoose.connect(process.env.MONGO_URI)

export async function hashPassword(password){
  return await bcrypt.hash(password, 10);
}


export async function login(req, res) {
  const {email, password} = req.body;
  try {
    const user_account = await user.findOne({email: email, password: password});
    if (!user_account)
      res.status(401).json({message: "Invalid email or password"});

    const key = await hashPassword(password);

    if(!key)
      res.status(401).json({message: "Invalid email or password"});

    req.session.secret = req.body.password;
    res.redirect(301, `/home?token=${encodeURIComponent(key)}`)
  } catch (err) {
    res.status(501)
  }
}