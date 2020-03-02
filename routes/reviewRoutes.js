const express = require('express');

const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

//MIDDLEWARE
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.addNewReview
  );

router
  .route('/:id')
  .get(reviewController.getReviewById)
  .delete(reviewController.deleteReview)
  .patch(reviewController.updateReview);

module.exports = router;
