const Tour = require('./../models/tourModel');

//TOP LEVEL CODE EXECUTED ONCE, READ DATA HERE
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

class APIFeatures {
  constructor(query, queryStrVal) {
    this.query = query;
    this.queryStrVal = queryStrVal;
  }

  filter() {
    //Removing pagination, sort params out of query strings, because they aren't used to filter the data by name or difficulty params
    const queryCopy = { ...this.queryStrVal };
    const excludedQueryFields = ['page', 'sort', 'limit', 'fields'];
    excludedQueryFields.forEach(field => delete queryCopy[field]);

    // Filtering with operators
    let queryString = JSON.stringify(queryCopy);
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => {
      return `$${match}`;
    }); //finding one of those operators and replacing it with the operator name + $

    this.query = this.query.find(JSON.parse(queryString));
    return this;
  }

  sort() {
    // 2) Sorting
    if (this.queryStrVal.sort) {
      const sortBy = this.queryStrVal.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryStrVal.fields) {
      const fields = this.queryStrVal.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    // 4) Pagination
    const page = this.queryStrVal.page * 1 || 1;
    const resultsLimit = this.queryStrVal.limit * 1 || 100;
    const skip = (page - 1) * resultsLimit;

    this.query = this.query.skip(skip).limit(resultsLimit);

    return this;
  }
}

// ROUTE HANDLES
exports.getAllTours = async (req, res) => {
  try {
    //const tours = Tour.find().where('duration').equals(5).where.('difficulty').equals('easy');
    //const tours = await Tour.find();

    //EXECUTED QUERY
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tours = await features.query;

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: { tours }
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error
    });
  }
};

exports.getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: { tour }
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error
    });
  }
};

exports.addNewTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'failt',
      message: 'Invalid data sent'
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(201).json({
      status: 'success',
      data: {
        tour: updatedTour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(201).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};
