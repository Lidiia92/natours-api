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

    console.log(this);
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

module.exports = APIFeatures;
