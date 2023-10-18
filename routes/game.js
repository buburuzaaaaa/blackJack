import { sendFileNav } from '../controllers/nav-controller.js';
import express from 'express';
import bodyParser from 'body-parser';
import { deck, display, getValue, hit, stand, generalWin, result } from '../controllers/game-controller.js';
const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(express.urlencoded({ extended: false, limit: 100000, parameterLimit: 6}))

router.route('/').get(deck)
router.route('/start').get(getValue, generalWin, display)
router.route('/hits').get(hit)
router.route('/stand').get(stand);
router.route('/result/:type').get(result);
export default router