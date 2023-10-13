import path from 'path';
import { fileURLToPath } from 'url'; 
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));


/*
    purpose of check is if need to send file only accessible to current and verified users 
    then you have to check if they have the nessary permissions
*/

export function sendFileNav(filePath){
    return (req, res) => {
        res.status(200).sendFile(path.join(__dirname, filePath));
    }
}

export function redirectNav(filePath){
    return (req, res) => {
        res.redirect(301, filePath);
    }
}

export function renderNav(filePath, object){
    return (req, res) => {
        res.render(path.join(__dirname, filePath), object);
    }
}