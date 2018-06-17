const express = require('express');
const passport = require('passport');

const authServer = require('./auth');

const router = express.Router();

const authController = require('../../controllers/auth.js');
const accessController = require('../../controllers/access.js');
const accountController = require('../../controllers/account.js');
const domainController = require('../../controllers/domain.js');

const accessRouter = express.Router();
accessRouter.get('/', accessController.list);
accessRouter.get('/full', accessController.fullList);
accessRouter.get('/:id', accessController.byId);
accessRouter.get('/full/:id', accessController.fullById);
accessRouter.post('/', accessController.add);
accessRouter.put('/:id', accessController.update);

const accountRouter = express.Router();
accountRouter.get('/', accountController.list);
accountRouter.get('/:name', accountController.byName);
accountRouter.post('/', accountController.add);
accountRouter.put('/:name', accountController.updateByName);
accountRouter.get('/:id/extend', accountController.extend);
accountRouter.put('/:id/extend', accountController.updateExtend);

const domainRouter = express.Router();
domainRouter.get('/', domainController.list);
domainRouter.get('/:value', domainController.byValue);
domainRouter.post('/', domainController.add);
domainRouter.put('/:value', domainController.update);

module.exports = app => {
  const { login, scope } = authServer;

  router.post('/signin', passport.authenticate('local'), authController.signin);
  router.post('/logout', authController.logout);
  router.get('/token', login, authController.ossToken);

  router.use('/access', scope, accessRouter);
  router.use('/account', scope, accountRouter);
  router.use('/domain', scope, domainRouter);

  app.use(router);
};
