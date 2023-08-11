const mongoose = require('mongoose')
const { Schema } = mongoose


const courseSchema = new Schema({
    title: {
        type: String,
        required: [true, "課程標題為必填欄位"]
    },
    description: {
        type: String,
        required: [true, "課程說明為必填欄位"]
    },
    price: {
        type: Number,
        required: [true, "課程價格為必填欄位"]
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    pic: {
        type: String,
        required: [true, "課程圖片為必要欄位"]
    },
    student: {
        type: [String],
        default: []
    }
})


const Course = mongoose.model('Course', courseSchema)
module.exports = Course