const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const {
  AuthenticationError,
  ForbiddenError
} = require('apollo-server-express');
require('dotenv').config()

const gravatar = require('../util/gravatar')

module.exports = {
  signUp: async (parent, { username, email, password }, { models }) => {
    // 電子郵件地址正規化
    email = email.trim().toLowerCase();
    // 對密碼進行雜湊
    const hashed = await bcrypt.hash(password, 10);
    // 建立gravatar url
    const avatar = gravatar(email);
    try {
      const user = await models.User.create({
        username,
        email,
        avatar,
        password: hashed
      });

      // 建立並回購json網頁token
      return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    } catch (err) {
      console.log(err)
      // 若建立帳戶時發生問題，則拋出問題
      throw new Error('Error creating account');
    }
  },
  signIn: async (parent, { username, email, password }, { models }) => {
    if (email) {
      // 將電子郵件地址正規化
      email = email.trim().toLowerCase();
    }

    const user = await models.User.findOne({
      $or: [{ email }, { username }]
    });

    // 若找不到使用者，則拋出驗證錯誤
    if (!user) {
      throw new AuthenticationError('Error signing in');
    }

    // 若密碼不符，則拋出驗證錯誤
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      throw new AuthenticationError('Error signing in');
    }

    return jwt.sign({ id: user._id }, process.env.JWT_SECRET)
  },
  // 新增使用者 user
  newNote: async (parent, { content, author }, { models, user }) => {
    // 若 context 上沒有使用者，則拋出驗證錯誤
    if (!user) {
      throw AuthenticationError('You must be signed in to create a note!');
    }

    return await models.Note.create({
      content,
      // 參考作者的 mongo id
      author: mongoose.Types.ObjectId(user.id)
    })
  },
  updateNote: async (parent, { id, content }, { models, user }) => {
    // 若非使用者，則拋出驗證錯誤
    if (!user) {
      throw new AuthenticationError("you must be signed in.")
    }

    // find note id
    const note = await models.Note.findById(id);
    if (note && String(note.author) !== user.id) {
      throw ForbiddenError("You dont have the permissions.")
    }

    return await models.Note.findOneAndUpdate(
      {
        _id: id
      },
      {
        $set: {
          content
        }
      },
      {
        new: true
      }
    );
  },
  deleteNote: async (parent, { id }, { models, user }) => {
    // 若非使用者，throw Authentication Error
    if (!user) {
      throw new AuthenticationError('You must be signed in to delete a note.');
    }

    // 尋找 note
    const note = await models.Note.findById(id);
    // 若note所有者與目前使用者不符合，throw forbiddenError
    if (note && String(note.author) !== user.id) {
      throw new ForbiddenError('You dont have permissions to delete the note.');
    }

    try {
      // 若一切吻合，則移除 note
      // await models.Note.findOneAndRemove({ _id: id });
      await note.remove();
      return true
    } catch (err) {
      // 若過程中發生錯誤, return false
      return false;
    }
  },
  toggleFavorite: async (parent, { id }, { models, user }) => {
    // 若傳遞使用者 context（未登入） 則拋出驗證錯誤
    if (!user) {
      throw new AuthenticationError("You must log in.");
    }

    // 檢查使用者使用者已經將 note 加入最愛
    let noteCheck = await models.Note.findById(id);
    const hasUser = noteCheck.favoritedBy.indexOf(user.id);

    // 如果使用者存在於清單中
    // 將他們從清單中提取並將 favoriteCount - 1
    // $pull $inc
    if (hasUser >= 0) {
      return await models.Note.findByIdAndUpdate(
        id,
        {
          $pull: {
            favoritedBy: mongoose.Types.ObjectId(user.id)
          },
          $inc: {
            favoriteCount: -1
          }
        },
        {
          // Set new to true to return the updated doc
          new: true
        }
      );
    } else {
      return await models.Note.findByIdAndUpdate(
        id,
        {
          $push: {
            favoritedBy: mongoose.Types.ObjectId(user.id)
          },
          $inc: {
            favoriteCount: 1
          }
        },
        {
          // Set new to true to return the updated doc
          new: true
        }
      );
    }
  }
}