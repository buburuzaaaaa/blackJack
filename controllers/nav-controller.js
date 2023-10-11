import path from 'path';
import { fileURLToPath } from 'url'; 
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));


/*
    purpose of check is if need to send file only accessible to current and verified users 
    then you have to check if they have the nessary permissions
*/

export function sendFileNav(filePath, check){
    if(check){
        return (req, res) => {
            if(req.query.token && req.session.secret)
                res.status(200).sendFile(path.join(__dirname, filePath));
        }
    }else{
        return (req, res) => {
            res.status(200).sendFile(path.join(__dirname, filePath));
        }
    }
}

export function redirectNav(filePath, check){
    if(check){
        return (req, res) => {
            if(req.query.token && req.session.secret)
                res.redirect(301, `${filePath}?token=${req.query.token}`);
        }
    }else{
        return (req, res) => {
            res.redirect(301, filePath);
        }
    }
}

export function renderNav(filePath, object){
    return (req, res) => {
        if(req.query.token && req.session.secret)
            res.render(filePath, object);
    }
}