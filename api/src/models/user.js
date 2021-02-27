const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      index: { unique: true }
    },
    email: {
      type: String,
      required: true,
      index: { unique: true }
    },
    password: {
      type: String,
      required: true
    },
    avatar: {
      type: String
    }
  },
  {
    // 將使用Date類型指派 createdAt 和 updatedAt 欄位
    timestamps: true
  }
);

const User = mongoose.model('User', UserSchema);
module.exports = User;