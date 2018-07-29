const express = require('express');
const passport = require('passport');

const authServer = require('./auth');

const router = express.Router();

const authController = require('../../controllers/auth');
const accessController = require('../../controllers/access');
const clienterrorController = require('../../controllers/clienterror');
const accountController = require('../../controllers/account');
const domainController = require('../../controllers/domain');
const orderController = require('../../controllers/order');
const organizationController = require('../../controllers/organization');
const linkTempController = require('../../controllers/linkTemplate');
const productController = require('../../controllers/product');
const resourceController = require('../../controllers/resource');
const viewController = require('../../controllers/view');

const accessRouter = express.Router();
accessRouter.get('/', accessController.list);
accessRouter.get('/full', accessController.fullList);
accessRouter.get('/:id', accessController.byId);
accessRouter.get('/full/:id', accessController.fullById);
// accessRouter.post('/', accessController.add);
// accessRouter.put('/:id', accessController.update);

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
// orderRouter.post('/', orderController.add);
orderRouter.put('/:id', orderController.update);

const organizationRouter = express.Router();
organizationRouter.get('/', organizationController.list);
// organizationRouter.get('/accounts/:name', organizationController.account);
// organizationRouter.get('/accounts', organizationController.accounts);
organizationRouter.get('/:name', organizationController.byName);
organizationRouter.post('/', organizationController.add);
// organizationRouter.post('/accounts', organizationController.addAccount);
organizationRouter.put(
//   '/accounts/:id/extend',
//   organizationController.updateAccountExtend
// );
// organizationRouter.put('/accounts/:name', organizationController.updateAccount);
organizationRouter.put('/:name', organizationController.update);
// organizationRouter.delete('/accounts/:name', organizationController.delAccount);

const linkTempRouter = express.Router();
linkTempRouter.get('/', linkTempController.list);
linkTempRouter.get('/:id', linkTempController.byId);
linkTempRouter.post('/', linkTempController.add);
linkTempRouter.put('/:id', linkTempController.update);
linkTempRouter.delete('/:id', linkTempController.del);

const productRouter = express.Router();
productRouter.get('/', productController.list);
productRouter.get('/:name', productController.byName);
productRouter.post('/', productController.add);
productRouter.put('/:name', productController.update);

const resourcetRouter = express.Router();
resourcetRouter.get('/', resourceController.list);
resourcetRouter.get('/:id', resourceController.byId);
resourcetRouter.post('/', resourceController.add);
resourcetRouter.put('/:id', resourceController.update);
resourcetRouter.delete('/:id', resourceController.delete);

const viewRouter = express.Router();
viewRouter.get('/card/:accountId', viewController.card);
viewRouter.get('/:name/:accountId', viewController.product);

module.exports = app => {
  const { login, scope } = authServer;

  router.post('/order', orderController.add);
  router.post('/logout', authController.logout);
  router.get('/proxy/:load([/\\w]+)', domainController.proxy);
  router.post('/access', accessController.add);
  router.get('/clienterror', clienterrorController.list);
  router.post('/clienterror', clienterrorController.add);
  router.put('/access/:id', accessController.update);

  router.post('/signin', passport.authenticate('local'), authController.signin);
  router.get('/token', login, authController.ossToken);

  router.use('/view', viewRouter);
  router.use('/access', scope, accessRouter);
  router.use('/account', scope, accountRouter);
  router.use('/domain', scope, domainRouter);
  router.use('/order', scope, orderRouter);
  router.use('/organization', scope, organizationRouter);
  router.use('/linkTemplate', scope, linkTempRouter);
  router.use('/product', scope, productRouter);
  router.use('/resource', scope, resourcetRouter);

  app.use(router);
};
