const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://Yinks:234Academics@cluster0.tf2bvm1.mongodb.net/tasknest?retryWrites=true&w=majority';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;