const fs = require('fs');
const express = require('express');

const app = express();

//TOP LEVEL CODE EXECUTED ONCE, READ DATA HERE
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tours: tours
    }
  });
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
