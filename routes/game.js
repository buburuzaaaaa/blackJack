import { sendFileNav } from '../controllers/nav-controller.js';
import express from 'express';
import bodyParser from 'body-parser';
const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(express.urlencoded({ extended: false, limit: 100000, parameterLimit: 6}))

router.route('/').get(sendFileNav("../public/game.html", true))
export default router