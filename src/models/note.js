const mongoose = require('mongoose')
const noteSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    // 新增 favoriteCount 属性
    favoriteCount: {
      type: Number,
      default: 0
    },
    // 新增 favoritedBy 属性
    favoritedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    // 使用 Date 類型指派 createdAt & updatedAt
    timestamps: true
  }
)
const Note = mongoose.model('Note', noteSchema)

module.exports = Note