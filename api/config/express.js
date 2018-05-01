const express = require('express');
const glob = require('glob');

const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const compress = require('compression');
const methodOverride = require('method-override');

// const mongoose = require('mongoose');
// const config = require('./config');

// mongoose.connect(config.db);
// const db = mongoose.connection;

module.exports = (app, config) => {
  const env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env == 'development';

  app.set('views', config.root + '/app/views');
  app.set('view engine', 'ejs');

  // app.all('*', function(req, res, next) {
  //   // res.header("Access-Control-Allow-Origin", req.headers.origin);
  //   // res.header("Access-Control-Allow-Credentials", true);
  //   // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type");
  //   // res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  //   // res.header("X-Powered-By",' 3.2.1')
  //   // res.header("Content-Type", "application/json;charset=utf-8");

  //   // res.header("Access-Control-Allow-Origin", req.headers.origin); //需要显示设置来源
  //   // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  //   // res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  //   // res.header("Access-Control-Allow-Credentials", true); //带cookies
  //   // res.header("X-Powered-By",' 3.2.1')
  //   // res.header("Content-Type", "application/json;charset=utf-8");
  //   next();
  // });

  app.use(favicon(config.root + '/public/img/favicon.ico'));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: true
    })
  );
  app.use(cookieParser('sessiontest'));
  app.use(
    session({
      secret: 'sessiontest', //与cookieParser中的一致
      saveUninitialized: false, // 是否自动保存未初始化的会话，建议false
      resave: false, // 是否每次都重新保存会话，建议false
      cookie: { maxAge: 6 * 3600 * 1000 }
      // store: new MongoStore({mongooseConnection: db})
    })
  );
  app.use(compress());
  app.use(express.static(config.root + '/public'));
  app.use(methodOverride());

  var controllers = glob.sync(config.root + '/app/controllers/*.js');
  controllers.forEach(controller => {
    require(controller)(app);
  });

  app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err,
        title: 'error'
      });
    });
  }

  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {},
      title: 'error'
    });
  });

  return app;
};
