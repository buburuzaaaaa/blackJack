import { sendFileNav } from './controllers/nav-controller.js';
import { getUser } from './controllers/user-controller.js';
import signup from './routes/signup.js';
import {access} from './middleware/access.js';
import { login } from './middleware/login.js';
import game from './routes/game.js'

import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url'; 

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false, limit: 100000, parameterLimit: 6}))
app.use(session({secret: 'place-holder', resave: false, saveUninitialized: true,}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/signup', signup)
app.use('/game', access, game)

app.route('/').get(sendFileNav("../public/index.html", false)).post(login);
app.get('/home', access, getUser);

app.listen(5000);