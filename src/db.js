// ongoose func lib
const mongoose = require('mongoose');

module.exports = {
  connect: DB_HOST => {
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useFindAndModify', false)
    mongoose.set('useCreateIndex', true)
    mongoose.set('useUnifiedToplogy', true)
    mongoose.connect(DB_HOST)
    mongoose.connection.on('error', err => {
      console.error(err)
      console.log('Mongodb connection error. Please make sure mongodb is running.')
      process.exit();
    });
  },
  close: () => {
    mongoose.connection.close()
  }
}
