const express = require('express');
const passport = require('passport');

const authServer = require('./auth');

const router = express.Router();

const authController = require('../../controllers/auth.js');
const accessController = require('../../controllers/access.js');
const accountController = require('../../controllers/account.js');
const domainController = require('../../controllers/domain.js');
const orderController = require('../../controllers/order.js');
const organizationController = require('../../controllers/organization.js');

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

const orderRouter = express.Router();
orderRouter.get('/', orderController.list);
orderRouter.get('/full', orderController.fullList);
orderRouter.get('/:id', orderController.byId);
orderRouter.post('/', orderController.add);
orderRouter.put('/:id', orderController.update);

const organizationRouter = express.Router();
organizationRouter.get('/', organizationController.list);
organizationRouter.get('/:name', organizationController.byName);
organizationRouter.post('/', organizationController.add);
organizationRouter.put('/:name', organizationController.update);

module.exports = app => {
  const { login, scope } = authServer;

  router.post('/signin', passport.authenticate('local'), authController.signin);
  router.post('/logout', authController.logout);
  router.get('/token', login, authController.ossToken);

  router.use('/access', scope, accessRouter);
  router.use('/account', scope, accountRouter);
  router.use('/domain', scope, domainRouter);
  router.use('/order', scope, orderRouter);
  router.use('/organization', scope, organizationRouter);

  app.use(router);
};
