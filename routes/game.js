import { sendFileNav } from '../controllers/nav-controller.js';
import express from 'express';
import bodyParser from 'body-parser';
import { deck, display, getValue } from '../controllers/game-controller.js';
const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(express.urlencoded({ extended: false, limit: 100000, parameterLimit: 6}))

router.route('/').get(deck, getValue, display)
router.route('/hit')
router.route('/stand')
export default router