const mongoose = require('mongoose')

const optionsSchema = mongoose.Schema({
    text: String,
    imageURL: String
})

const questionSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    optionsType: {
        type: String,
        enum: ['text', 'imageURL', 'text+imageURL'],
        default: 'text'
    },
    options: {
        type: [optionsSchema],
        validate: (val) => val.length >= 2 && val.length <= 4
    },
    correctAnswer: {
        type: String,
        required: () => this.quizType === 'QnA'
    },
    // TODO: submitted options count
    submissionCount: {
        type: {
            "Option 1": {
                type: Number,
                default: 0
            },
            "Option 2": {
                type: Number,
                default: 0
            },
            "Option 3": {
                type: Number,
                default: 0
            },
            "Option 4": {
                type: Number,
                default: 0
            },
        },
        default: () => ({})
    }
})

const quizSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    quizType: {
        type: String,
        enum: ['QnA', 'Poll'],
        required: true
    },
    timer: {
        type: String,
        enum: ['OFF', '5 sec', '10 sec'],
        default: 'OFF'
    },
    questions: {
        type: [questionSchema],
        validate: (val) => val.length >= 1 && val.length <= 5
    },
    impressions: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: String
    }
}, { timestamps: true })

const Quiz = mongoose.model('Quiz', quizSchema)

module.exports = Quiz