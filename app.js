import { sendFileNav } from './controllers/nav-controller.js';

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


app.route('/').get(sendFileNav("../public/index.html", false));


app.listen(5000);