// requires

module.exports = {
  login: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }

    res.json(401, { errMsg: '需要登录!1' });
  },
  scope: (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.json(401, { errMsg: '需要登录!2' });
    }

    next();
  }
};
