import { sendFileNav } from './controllers/nav-controller.js';
import { getUser } from './controllers/user-controller.js';
import signup from './routes/signup.js';
import { login } from './middleware/login.js';
import { isAuthenticated } from './middleware/auth.js'; 
import game from './routes/game.js'

import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url'; 
import passport from 'passport';
import passportSetup from './config/passportSetup.js';
passportSetup(passport)

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false, limit: 100000, parameterLimit: 6}))
app.use(session({
    secret: "fyhifwheufhuwebvfiwuygf38274gf23087gf32407h",
    deck_id: 'place-holder', 
    player: {
        cards: [],
        value: 0
    },
    dealer: {
        cards: [],
        value: 0
    },
    resave: false, 
    saveUninitialized: true,
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
app.use('/signup', signup)
app.use('/game', isAuthenticated, game)

app.route('/').get(sendFileNav("../public/index.html")).post(login);
app.get('/home', isAuthenticated, getUser);

app.listen(5000);