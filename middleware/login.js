import bcrypt from 'bcrypt';
import passport from 'passport';

export async function hashPassword(password){
  return await bcrypt.hash(password, 10);
}

export function login(req, res, next){
  passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/'
  })(req, res, next);
}