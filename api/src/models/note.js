const mongoose = require('mongoose')
const noteSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    }
  },
  {
    // 使用 Date 類型指派 createdAt & updatedAt
    timestamps: true
  }
)
const Note = mongoose.model('Note', noteSchema)

module.exports = Note