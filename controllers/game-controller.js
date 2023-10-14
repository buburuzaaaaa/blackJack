import path from 'path';
import { fileURLToPath } from 'url'; 
import fetch from 'node-fetch';
import { sendFileNav } from './nav-controller.js';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const getOption = {
    method: 'GET',
    headers: {'Content-Type': 'application/json'}
}


export async function deck(req, res, next){
    const url = "https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1";
    const response = await fetch(url, getOption)
    const deck = await response.json();
    if(!deck.success)
        res.redirect(301, "/home");
    req.session.deck_id = deck.deck_id;
    req.session.player = {cards: [], value: 0}
    req.session.dealer = {cards: [], value: 0}
    await startingHand(req);
    next()
}

export async function startingHand(req){
    const {deck_id, player, dealer} = req.session;
    const url = `https://www.deckofcardsapi.com/api/deck/${deck_id}/draw/?count=4`
    const response = await fetch(url, getOption);
    const cards = await response.json();
    for(let i=0; i<cards.cards.length; i++) {
        cards.cards[i].side = "";
        if(i%2 == 0){
            player.cards.push(cards.cards[i]);
        }else{
            if(i == 3)
                cards.cards[i].side = "https://www.deckofcardsapi.com/static/img/back.png"
            dealer.cards.push(cards.cards[i]);
        }
    }
}

export function getValue(req, res, next){
    const {player, dealer} = req.session;
    const people = [player, dealer];
    people.forEach((person) => {
        person.cards.forEach((card) => {
            if(card.value === "ACE")
                person.value += 11 || 1;
            else if(!Number.isInteger(Number(card.value)))
                person.value += 10;
            else
                person.value += Number(card.value);
        })
    })
    next();
}


export function display(req, res){
    const {player, dealer} = req.session;
    res.render(path.join(__dirname, '../public/game.ejs'), {player:player, dealer:dealer});
}