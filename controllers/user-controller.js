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
            password: await hashPassword(password),
        });
        await newPerson.validate();
        await newPerson.save();
        res.redirect(301, `/home`)
    }catch(e) {
        console.error('Error creating person:', e);
        res.status(500).json({ error: 'An error occurred while creating the person' });
    }
    
}


export async function getUser(req, res) {
    try {
        const {user} = req;
        res.render(path.join(__dirname, "../public/home.ejs"), {User: user});
    } catch (error) {
        res.status(500).json({ error: 'An error occurred'});
    }
}