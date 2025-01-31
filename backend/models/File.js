const mongoose = require('mongoose')

const fileSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    teamName: {
        type: String,
        required: true
    },
    content: {
        type: Array, 
        default: [] 
    },
    permissions: [
        {
            email: String,
            role: String
        }
    ]
}, { timestamps: true } )

const File = mongoose.model('File', fileSchema);

module.exports = File;