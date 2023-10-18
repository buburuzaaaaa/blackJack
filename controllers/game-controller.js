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


// function to draw specific amount of cards
async function drawCards(count, req){
    const {deck_id} = req.session;
    const url = `https://www.deckofcardsapi.com/api/deck/${deck_id}/draw/?count=${count}`
    const response = await fetch(url, getOption);
    const card = await response.json();
    return card
}

// function to display and update interface for players
export function display(req, res){
    const {player, dealer} = req.session;
    res.render(path.join(__dirname, '../public/game.ejs'), {player:player, dealer:dealer});
}

// function to give cards to specific players or dealer
async function assignCard(req, check){
    const {player, dealer} = req.session;
    var card = await drawCards(1, req);
    if(check === true) 
        player.cards.push(card.cards[0])
    else{
        card.cards[0].side = "https://www.deckofcardsapi.com/static/img/back.png"
        dealer.cards.push(card.cards[0]);
        for(let i=0; i<dealer.cards.length; i++){
            if(i != dealer.cards.length-1)
                dealer.cards[i].side = "";
        }
    }
}


// start function, creates deck from api and sets session data
export async function deck(req, res, next){
    const url = "https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1";
    const response = await fetch(url, getOption)
    const deck = await response.json();
    if(!deck.success)
        res.redirect(301, "/home");
    req.session.deck_id = deck.deck_id;
    req.session.player = {cards: [], value: 0}
    req.session.dealer = {cards: [], value: 0}
    await startingHand(req, res);
    res.render(path.join(__dirname, "../public/game-start.ejs"), {});
}
// part of deck function, deals out initial cards
export async function startingHand(req, res){
    for(let i=0; i<4; i++) {
        if(i%2==0)
            await assignCard(req, true)
        else
            await assignCard(req, false)
    }
}


// counts value of cards and sets session data accordingly
// also checks certain win conditions
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
    next()
}

export async function generalWin(req, res, next){
    const {player, dealer} = req.session;
    console.log(player.value, dealer.value)
    if(player.value === 21 || dealer.value > 21){
        user.findOneAndUpdate({ password: req.user.password }, { $inc: { win: 1 } }, { new: true })
            .then(updatedUser =>{
                res.render(path.join(__dirname, "../public/result.ejs"), {result: "won"});
            });
    }else if(player.value > 21 || dealer.value === 21){
        user.findOneAndUpdate({ password: req.user.password }, { $inc: { loss: 1 } }, { new: true })
            .then(updatedUser =>{
                res.render(path.join(__dirname, "../public/result.ejs"), {result: "lost"});
            });
    }else{
        next();
    }
}

// Function to hit, will assign cards to players and/or dealer if dealer has less than 17 points
export async function hit(req, res){
    const {dealer} = req.session;
    if(dealer.value >= 17)
        await assignCard(req, true);
    else{
        await assignCard(req, true);
        await assignCard(req, false);
    }
    res.status(200).redirect('/game/start')
}

// Function to stand, will check if dealer wins or give dealer a card 
export async function stand(req, res){
    const {dealer} = req.session;
    if(dealer.value >= 17)
        await win(req, res)
    else
        await assignCard(req, res, false)
    
    res.status(200).redirect('/game/start')
}

// checks if anyone wins after a stand
async function win(req, res){
    const {player, dealer} = req.session;
    var result;
    if(player.value>dealer.value){
        await user.findOneAndUpdate({ password: req.user.password }, { $inc: { win: 1 } }, { new: true });
        result = "won";
    }else if(player.value===dealer.value){
        result = "tie";
    }else if(player.value<dealer.value){
        await user.findOneAndUpdate({ password: req.user.password }, { $inc: { loss: 1 } }, { new: true });
        result = "lost";
    }
    res.render(path.join(__dirname, "../public/result.ejs"), {result: result});
}




