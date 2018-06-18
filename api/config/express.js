const glob = require('glob');
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const favicon = require('serve-favicon');

const configureSession = require('./configureSession');
const configurePassport = require('./configurePassport');

module.exports = (app, config) => {
  const env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env == 'development';

  app.set('views', config.root + '/app/views');
  app.set('view engine', 'ejs');

  app.use(favicon(config.root + '/public/img/favicon.ico'));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(compress());
  app.use(
    bodyParser.urlencoded({
      extended: true
    })
  );
  configureSession(app);
  configurePassport(app);
  app.use(methodOverride());
  app.use(express.static(config.root + '/public'));

  var servers = glob.sync(config.root + '/app/servers/**/index.js');
  servers.forEach(server => {
    require(server)(app);
  });

  app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {},
      title: 'error'
    });
  });

  return app;
};

//
// const passport = require('passport');

// const LocalStrategy = require('passport-local').Strategy;

// passport.use(
//   'local',
//   new LocalStrategy(function(username, password, done) {
//     console.info('----');
//     return done(null, { user: 'x' });
//     // findUser(username, function (err, user) {
//     //   if (err) {
//     //     return done(err)
//     //   }
//     //   if (!user) {
//     //     return done(null, false)
//     //   }
//     //   if (password !== user.password  ) {
//     //     return done(null, false)
//     //   }
//     //   return done(null, user)
//     // })
//   })
// );

// passport.serializeUser(function(user, done) {
//   //保存user对象
//   console.info('serializeUser');
//   done(null, user); //可以通过数据库方式操作
// });

// passport.deserializeUser(function(user, done) {
//   //删除user对象
//   console.info('deserializeUser');
//   done(null, user); //可以通过数据库方式操作
// });

// module.exports = (app, config) => {
//   app.use(passport.initialize());
//   app.use(passport.session());
//

// };
