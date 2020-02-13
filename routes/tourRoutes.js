const express = require('express');

const tourController = require('../controllers/tourController');

//MIDDLEWARE
const route = express.Router();

route
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.addNewTour);

route
  .route('/:id')
  .get(tourController.getTourById)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = route;
