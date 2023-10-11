import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { hashPassword } from '../middleware/login.js';
import user from '../models/users.js';
dotenv.config();
mongoose.connect(process.env.MONGO_URI)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function createUser(req, res){
    try{
        const { name, email, password } = req.body;
        const newPerson = new user({
            name,
            email,
            password,
        });
        await newPerson.validate();
        await newPerson.save();
        const key = await hashPassword(password);
        req.session.secret = password;
        if(key)
            res.redirect(301, `/home?token=${encodeURIComponent(key)}`)
    }catch(e) {
        console.error('Error creating person:', e);
        res.status(500).json({ error: 'An error occurred while creating the person' });
    }
    
}


export async function getUser(req, res) {
    try {
        const {secret} = req.session;
        const person = await user.findOne({password: secret});
        if(!person)
            res.status(404).json({ error: 'Account not found' });
        res.render(path.join(__dirname, "../public/home.ejs"), {User: person});
    } catch (error) {
        res.status(500).json({ error: 'An error occurred'});
    }
}