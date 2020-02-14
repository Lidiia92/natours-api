const Tour = require('./../models/tourModel');

//TOP LEVEL CODE EXECUTED ONCE, READ DATA HERE
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// ROUTE HANDLES
exports.getAllTours = (req, res) => {
  console.log('Getting all tour data');
};

exports.getTourById = (req, res) => {
  console.log('Getting tour with id');
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

exports.updateTour = (req, res) => {
  console.log('Update tour');
};

exports.deleteTour = (req, res) => {
  console.log('Delete tour');
};
