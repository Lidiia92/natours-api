const AppError = require('../utils/appError');
const Review = require('./../models/reviewModel');
const catchAsync = require('../utils/catchAsync');

// ROUTE HANDLES
exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) {
    filter = { tour: req.params.tourId };
  }
  //EXECUTED QUERY
  const reviews = await Review.find(filter);

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: { reviews }
  });
});

exports.addNewReview = catchAsync(async (req, res, next) => {
  if (!req.body.tour) {
    req.body.tour = req.params.tourId;
  }

  if (!req.body.user) {
    req.body.user = req.user.id;
  }

  const newReview = await Review.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      review: newReview
    }
  });
});
