const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    unique: true,
    trim: true
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'MaxGroupSize is required']
  },
  difficulty: {
    type: String,
    required: [true, 'Difficulty is required']
  },
  ratingsAverage: {
    type: Number,
    default: 4.5
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'Price is required']
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, 'Summary is required']
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, 'Image is required']
  },
  images: {
    type: [String]
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  startDates: {
    type: [Date]
  }
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
