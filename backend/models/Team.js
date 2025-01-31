const mongoose = require('mongoose')

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String
    }
})


const Team = mongoose.model('Team', teamSchema)

module.exports = Team