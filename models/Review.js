const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a review title'],
    maxlength: 100,
  },
  text: {
    type: String,
    required: [true, 'Please add some text'],
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, 'Please add a rating from 1 to 10'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
});

// Prevent more than 1 review per user per bootcamp
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

/**
 * @description Static method declared on the CLASS/Model to get avg of rating of the bootcamp
 *
 * @param {Object} bootcampId
 */
ReviewSchema.statics.getAverageReview = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: '$bootcamp',
        averageRating: { $avg: '$rating' },
      },
    },
  ]);

  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageRating: obj[0].averageRating,
    });
  } catch (err) {
    console.error(err);
  }
};

// CALL getAverageReview after save
ReviewSchema.post('save', function (next) {
  this.constructor.getAverageReview(this.bootcamp);
});

// CALL getAverageReview before remove
ReviewSchema.pre('remove', function (next) {
  this.constructor.getAverageReview(this.bootcamp);
});

module.exports = mongoose.model('Review', ReviewSchema);
