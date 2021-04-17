const Query = require('./query')
const Mutation = require('./mutation')
const Note = require('./note')
const User = require('./user')
// 驗證新類型，自行編寫驗證，我們將增加驗證至任何要求有 DateTime 類型
const { GraphQLDateTime } = require('graphql-iso-date')

module.exports = {
  Query,
  Mutation,
  Note,
  User,
  DateTime: GraphQLDateTime
};
