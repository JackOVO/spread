const passport = require('passport');
const mongoose = require('mongoose');
const LocalStrategy = require('passport-local').Strategy;

const Account = mongoose.model('Account');

module.exports = app => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'name',
        passwordField: 'password'
      },
      function(name, password, done) {
        const _account = new Account({ name, password });
        Account.findOne({ name: _account.name }, (err, account) => {
          if (err) {
            return done(err);
          }

          if (!account) {
            return done(null, false, { errorMsg: '用户名或密码错误!' });
          }

          account.comparePwd(_account.password, (err, isMatch) => {
            if (err) {
              return done(err);
            } else if (isMatch) {
              return done(null, account);
            } else {
              return done(null, false, { errorMsg: '用户名或密码错误!' });
            }
          });
        });
      }
    )
  );

  passport.serializeUser(function(account, done) {
    done(null, account._id);
  });

  passport.deserializeUser(function(id, done) {
    Account.findById(id, (err, account) => {
      if (err) {
        return done(err);
      }

      done(null, account);
    });
  });

  app.use(passport.initialize());
  app.use(passport.session());

  // passportIns.use(new Strategy((token, cb) => {
  //   // jwt 会验证是否有效, 是否过了有效期
  //   jwt.verify(token, config.jwtSecret, (err, decoded) => {
  //     if (err) return cb(err.name);
  //     console.log('verifyInfo:', decoded);
  //     // token有效
  //     return User.getUsersByQuery({ logintoken: token })
  //       .then((user) => {
  //         if (!user) return cb('userNotFound');
  //         return cb(null, user);
  //       })
  //       .catch(dbErr => cb(dbErr));
  //   });
  // }));
};
