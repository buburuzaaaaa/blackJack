import { sendFileNav } from '../controllers/nav-controller.js';
import express from 'express';
import bodyParser from 'body-parser';
import { deck, display, getValue, hit, stand } from '../controllers/game-controller.js';
const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(express.urlencoded({ extended: false, limit: 100000, parameterLimit: 6}))

router.route('/').get(deck)
router.route('/start').get(getValue, display)
router.route('/hit').get(hit, getValue, display)
router.route('/stand').get(stand, getValue, display);
export default router