const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Review = require('../models/Review');
const Bootcamp = require('../models/Bootcamp');
const User = require('../models/User');

/**
 * @desc Get all reviews
 * @route GET /api/v1/reviews
 * @route GET /api/v1/bootcamps/:bootcampId/reviews
 * @access Public
 */
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId });
    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

/**
 * @desc Get a single reviews
 * @route GET /api/v1/reviews/:id
 *
 * @access Public
 */
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });
  if (!review) return next(new ErrorResponse('no review for this id', 404));

  res.status(200).json({
    success: true,
    data: review,
  });
});

/**
 * @desc Create a single review
 * @route POST /api/v1/bootcamp/:id/reviews
 *
 * @access Private
 */
exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp)
    return next(new ErrorResponse('we do not have this bootcamp', 404));

  const review = await Review.create(req.body);

  res.status(201).json({
    success: true,
    data: review,
  });
});

/**
 * @desc Update a single review
 * @route PUT /api/v1/reviews/:id
 *
 * @access Private
 */
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review)
    return next(new ErrorResponse('we do not have this review', 404));

  //MAke sure review belongs to user or admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('can not update a review', 401));
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(201).json({
    success: true,
    data: review,
  });
});

/**
 * @desc delete a single review
 * @route PUT /api/v1/reviews/:id
 *
 * @access Private
 */
exports.deleteReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review)
    return next(new ErrorResponse('we do not have this review', 404));

  //MAke sure review belongs to user or admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('can not delete a review', 401));
  }

  await review.deleteOne();

  res.status(201).json({
    success: true,
    data: {},
  });
});