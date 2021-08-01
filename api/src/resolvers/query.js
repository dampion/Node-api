// 除了建立分頁的功能外，此可限制透過API要求的資料量來避免server或db過載的查詢
// step 1 限制查詢可回傳的資料量
// step 2 限制 api查詢深度（限制查詢複雜性）
module.exports = {
  hello: () => 'Hello Evan!',
  notes: async (parent, args, { models }) => {
    return await models.Note.find().limit(50);
  },
  note: async (parent, args, { models }) => {
    return await models.Note.findById(args.id)
  },
  // user query
  user: async (parent, { username }, { models }) => {
    // 根據使用者名稱尋找使用者
    return await models.User.findOne({ username });
  },
  users: async (parent, args, { models }) => {
    // 尋找所有使用者
    return await models.User.find({}).limit(50);
  },
  me: async (parent, args, { models, user }) => {
    // 根據目前使用者 context 尋找使用者
    return await models.User.findById(user.id);
  },
  noteFeed: async (parent, { cursor }, { models }) => {
    // 將限制應編碼為10個項目
    const limit = 10;
    // 將預設的hasNextPage值設為false
    let hasNextPage = false;
    // 若為傳送游標，則預設查詢將是空的
    // 這將從db提取最新註記
    let cursorQuery = {};
    // 若有游標
    // 查詢將尋找 ObjectId 小於游標的註記
    if (cursor) {
      cursorQuery = { _id: { $lt: cursor } };
    }

    // 在db中尋找限制 + 1 個註記，從最新到最舊排序
    let notes = await models.Note.find(cursorQuery)
      .sort({ _id: -1 })
      .limit(limit + 1);

    // 如果尋找的註記數量超過限制
    // 將 hasNextPage 設為 true 並將註記調整至限制
    if (notes.length > limit) {
      hasNextPage = true;
      notes = notes.slice(0, -1)
    }

    // 新游標將是摘要陣列中最後一項的mongo物件ID
    const newCursor = notes[notes.length - 1]._id;

    return {
      notes,
      cursor: newCursor,
      hasNextPage
    }
  }
}