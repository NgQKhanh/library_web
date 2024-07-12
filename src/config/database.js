// database.js

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DATABASE,   
  process.env.USER,       
  process.env.PASSWORD,   
  {
    host: process.env.HOST,       
    dialect: 'mysql',             
    logging: false                
  }
);

// Import và khởi tạo model 
const models = {
  User: require('../models/user')(sequelize),  
  Book: require('../models/book')(sequelize), 
  BookCopy: require('../models/bookCopy')(sequelize),  
  BookRsvn: require('../models/bookRsvn')(sequelize), 
  Loan: require('../models/loan')(sequelize),  
  ReadingRoom: require('../models/readingRoom')(sequelize),  
  Reservation: require('../models/reservation')(sequelize)   
};

// Khởi tạo quan hệ giữa các models
Object.keys(models).forEach(modelName => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});

// Kiểm tra kết nối đến cơ sở dữ liệu
const checkConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connect to database successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = {
  sequelize,
  models,
  checkConnection
};
