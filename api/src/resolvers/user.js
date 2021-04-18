module.exports = {
    // 要求時解析使用者的 Note 清單
    notes: async (user, args, { models }) => {
        return await models.Note.find({ author: user._id }).sort({ _id: -1 })
    },
    // 要求時解析使用者的最愛清單
    favorites: async (user, args, { models }) => {
        return await models.Note.find({ favoriteBy: user._id }).sort({ _id: -1 })
    }
}