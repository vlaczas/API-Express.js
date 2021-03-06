const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');

/**
 * @desc Get all courses
 * @route GET /api/v1/courses
 * @route GET /api/v1/bootcamps/:bootcampId/couses
 * @access Public
 */
exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });
    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

/**
 * @desc Get single courses
 * @route GET /api/v1/courses/:id
 *
 * @access Public
 */
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });

  if (!course) return next(new ErrorResponse('No course with this id', 404));

  res.status(200).send({
    success: true,
    data: course,
  });
});

/**
 * @desc Add single course
 * @route POST /api/v1/bootcamps/:bootcampId/courses
 *
 * @access Privat
 */
exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp)
    return next(new ErrorResponse('No bootcamp with this id', 404));

  const course = await Course.create(req.body);

  res.status(200).send({
    success: true,
    data: course,
  });
});

/**
 * @desc Update single course
 * @route PUT /api/v1/courses/:id
 *
 * @access Privat
 */
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) return next(new ErrorResponse('No course with this id', 404));

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).send({
    success: true,
    data: course,
  });
});

/**
 * @desc Delete single course
 * @route DELETE /api/v1/courses/:id
 *
 * @access Privat
 */
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) return next(new ErrorResponse('No course with this id', 404));

  course.remove();

  res.status(200).send({
    success: true,
    data: {},
  });
});
