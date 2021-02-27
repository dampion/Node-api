// index.js
// This is the main entry point of our application
// 匯入 express
const express = require('express');
// 匯入 apllo server express lib
const { ApolloServer } = require('apollo-server-express')
// 匯入.env配置
require('dotenv').config();
// require db
const db = require('./db');
// access db host from .env
const DB_HOST = process.env.DB_HOST;
// access port from .env
const port = process.env.port || 4000;
// access models which is composed of all models
const models = require('./models')
// 結構描述
const typeDefs = require('./schema')
// 解析程式
const resolvers = require('./resolvers')

// 建立 express 實例
const app = express();
// db 進行連線
db.connect(DB_HOST)

// Apollo server 設定
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => {
    // 將db模型新增至 context
    return { models }
  }
})

// Apollo middleware 設定
server.applyMiddleware({ app, path: '/api' })
app.listen({ port }, () => {
  console.log(`GraphQL is running at port:${port}${server.graphqlPath}`)
})