// try graphql 訂閱
// try apollo engine

// index.js
// This is the main entry point of our application
// 匯入 express
const express = require('express');
const helmet = require('helmet'); // 安全中介軟體
const cors = require('cors');
const depthLimit = require('graphql-depth-limit');
const { createComplexityLimitRule } = require('graphql-validation-complexity');

// 匯入 apllo server express lib
const { ApolloServer } = require('apollo-server-express')
// 匯入.env配置
require('dotenv').config();
// require db
const db = require('./db');
// access db host from .env
const DB_HOST = process.env.DB_HOST;
// access port from .env
const port = process.env.PORT || 4000;
// access models which is composed of all models
const models = require('./models')
// 結構描述
const typeDefs = require('./schema')
// 解析程式
const resolvers = require('./resolvers')
// 匯入jwt模組
const jwt = require('jsonwebtoken')

// 從JWT取得使用者資訊
const getUser = token => {
  if (token) {
    try {
      // 從權杖回傳使用者資訊
      return jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
      throw new Error('Session invalid')
    }
  }
}

// 建立 express 實例
const app = express();
// 在堆疊最上方新增中介軟體
// Security middleware
app.use(helmet());
// CORS middleware
app.use(cors());
// db 進行連線
db.connect(DB_HOST)

// 跨來源資源共用
// COR 允許其他網域要求資源，因為 API 跟 UI 程式碼可能是分開的
// 因此要啟用來自其他來源的憑證

// Apollo server 設定
const server = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: [depthLimit(5), createComplexityLimitRule(1000)],
  context: ({ req }) => {
    // 從標頭(header)取得使用者權杖
    const token = req.headers.authorization;
    // 嘗試使用權杖擷取使用者
    const user = getUser(token);
    // 現在，我們將使用者機紀錄至主控台:
    console.log(user)
    // 將db模型新增至 context
    return { models, user }
  }
})

// Apollo middleware 設定
server.applyMiddleware({ app, path: '/api' })
app.listen({ port }, () => {
  console.log(`GraphQL is running at port:${port}${server.graphqlPath}`)
})