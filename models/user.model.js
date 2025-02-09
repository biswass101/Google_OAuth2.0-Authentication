const mongoose = require('mongoose')

const userShcema = mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true
    },
    googleId: {
        type: String,
        require: true,
    },

})

const User = mongoose.model("User", userShcema)

module.exports = User