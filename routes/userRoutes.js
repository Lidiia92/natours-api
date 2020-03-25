const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

//MIDDLEWARE
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

//Protects all routes that are below it
router.use(authController.protect);

router.patch('/updatePassword', authController.updatePassword);

router.get('/me', userController.getMe, userController.getUserById);
router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.addNewUser);

router
  .route('/:id')
  .get(userController.getUserById)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
