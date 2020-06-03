const mongoose = require('mongoose');

mongoose.set('debug', true);
mongoose.Promise = Promise;
mongoose
  .connect(`${process.env.MONGODB_URL}`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('DB connection successfull!'));
module.exports.Users = require('./UsersModel');
module.exports.Categories = require('./CategoriesModel');
