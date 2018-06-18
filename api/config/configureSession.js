const cookieParser = require('cookie-parser');
const session = require('express-session');

module.exports = app => {
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
  return app;
};
