import  {Strategy as LocalStrategy} from 'passport-local'
import user from '../models/users.js';

export default (passport) => {
  passport.use(new LocalStrategy(
    {usernameField : 'email', passwordField: 'password', session: true, passReqToCallback: false}, 
    async (email, password, done)=> {
      const user_account = await user.findOne({email});
      
      if(!user_account.validPassword(password)) return done(null, false);
      return done(null, user_account, false);
    })
  )
  passport.serializeUser((user, done) => {
    done(null, user.email);
  });
      
  passport.deserializeUser((email, done) => {
    user.findOne({ email }).then(personAccount => {
        return personAccount;
      })
      .then((err, account) => {done(account, err);})
  }); 
}