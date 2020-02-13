const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();

// 1) MIDDLEWARE ***

app.use(morgan('dev'));
//    TO PARSE THE DATA req.body
app.use(express.json());

app.use((req, res, next) => {
  console.log('Middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//***

//TOP LEVEL CODE EXECUTED ONCE, READ DATA HERE
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// 2) ROUTE HANDLES
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours
    }
  });
};

const getTourById = (req, res) => {
  //CONVERT STR ID TO A NUM
  const tourId = req.params.id * 1;
  const tourData = tours.find(tour => tour.id === tourId);

  if (!tourData) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: tourData
    }
  });
};

const addNewTour = (req, res) => {
  const newID = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newID }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour
        }
      });
    }
  );
};

const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length - 1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Update tour here>'
    }
  });
};

const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length - 1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }
  res.status(204).json({
    status: 'success',
    data: null
  });
};

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet implemented'
  });
};

const addNewUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet implemented'
  });
};

const getUserById = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet implemented'
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet implemented'
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet implemented'
  });
};

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTourById);
// app.post('/api/v1/tours', addNewTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// 3) ROUTES

//Middleware
const tourRoute = express.Router();
const userRoute = express.Router();

//tours
tourRoute
  .route('/')
  .get(getAllTours)
  .post(addNewTour);

tourRoute
  .route('/:id')
  .get(getTourById)
  .patch(updateTour)
  .delete(deleteTour);

//users
userRoute
  .route('/')
  .get(getAllUsers)
  .post(addNewUser);

userRoute
  .route('/:id')
  .get(getUserById)
  .patch(updateUser)
  .delete(deleteUser);

app.use('/api/v1/tours', tourRoute);
app.use('/api/v1/users', userRoute);

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
