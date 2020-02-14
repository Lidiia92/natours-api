const Tour = require('./../models/tourModel');

//TOP LEVEL CODE EXECUTED ONCE, READ DATA HERE
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// ROUTE HANDLES
exports.getAllTours = async (req, res) => {
  try {
    //const tours = Tour.find().where('duration').equals(5).where.('difficulty').equals('easy');
    //const tours = await Tour.find();

    //BUILD QUERY
    // 1a) Filtering
    //Removing pagination, sort params out of query strings, because they aren't used to filter the data by name or difficulty params
    const queryCopy = { ...req.query };
    const excludedQueryFields = ['page', 'sort', 'limit', 'fields'];
    excludedQueryFields.forEach(field => delete queryCopy[field]);

    // 1b) Filtering with operators
    let queryString = JSON.stringify(queryCopy);
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => {
      return `$${match}`;
    }); //finding one of those operators and replacing it with the operator name + $

    let query = Tour.find(JSON.parse(queryString));

    // 3) Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // 4) Limiting the returned fields
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    //EXECUTED QUERY
    const tours = await query;

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
