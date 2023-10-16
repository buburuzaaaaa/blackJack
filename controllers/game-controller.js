import path from 'path';
import { fileURLToPath } from 'url'; 
import fetch from 'node-fetch';
import { sendFileNav } from './nav-controller.js';
import user from '../models/users.js';
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
    await assingCards(4, req);
    res.render(path.join(__dirname, "../public/game-start.ejs"), {});
}

export async function assingCards(count, req){
    const {deck_id, player, dealer} = req.session;
    const url = `https://www.deckofcardsapi.com/api/deck/${deck_id}/draw/?count=${count}`
    const response = await fetch(url, getOption);
    const cards = await response.json();
    dealer.cards.forEach((x)=>{x.side=""})
    for(let i=0; i<cards.cards.length; i++) {
        cards.cards[i].side = "";
        if(i%2 == 0){
            player.cards.push(cards.cards[i]);
        }else{
            if(i == cards.cards.length-1)
                cards.cards[i].side = "https://www.deckofcardsapi.com/static/img/back.png"
            dealer.cards.push(cards.cards[i]);
        }
    }
}

export async function getValue(req, res, next){
    const {player, dealer} = req.session;
    player.value = 0;
    dealer.value = 0;
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
    if(player.value === 21){
        await user.findOneAndUpdate({ password: req.user.password }, { $inc: { win: 1 } }, { new: true });
        return res.render(path.join(__dirname, "../public/result.ejs"), {result: "won"});
    }
    if(player.value > 21){
        await user.findOneAndUpdate({ password: req.user.password }, { $inc: { loss: 1 } }, { new: true });
        return res.render(path.join(__dirname, "../public/result.ejs"), {result: "lost"});
    }
    next();
}


export async function hit(req, res, next){
    const {dealer} = req.session;
    if(dealer.value >= 17)
        await assingCards(1, req);
    else
        await assingCards(2, req);
    next();
}

export async function stand(req, res, next){
    const {deck_id, dealer} = req.session;
    if(dealer.value >= 17)
        next();
    else{
        const url = `https://www.deckofcardsapi.com/api/deck/${deck_id}/draw/?count=1`;
        const response = await fetch(url, getOption);
        const cards = await response.json();
        dealer.cards.forEach((x)=>{x.side = ""})
        cards.cards.side = "https://www.deckofcardsapi.com/static/img/back.png";
        dealer.cards.push(cards.cards);
        next();
    }
}


export function display(req, res){
    const {player, dealer} = req.session;
    res.render(path.join(__dirname, '../public/game.ejs'), {player:player, dealer:dealer});
}