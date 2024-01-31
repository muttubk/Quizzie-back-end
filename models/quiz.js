const mongoose = require('mongoose')

const optionsSchema = mongoose.Schema({
    text: {
        type: String,
        default: ""
    },
    imageURL: {
        type: String,
        default: ""
    }
})

const questionSchema = mongoose.Schema({
    id: {
        type: String
    },
    question: {
        type: String,
        required: true
    },
    optionsType: {
        type: String,
        enum: ['text', 'imageURL', 'textAndImageURL'],
        default: 'text'
    },
    options: {
        // type: [optionsSchema],
        type: {
            option1: {
                type: optionsSchema,
                required: true
            },
            option2: {
                type: optionsSchema,
                required: true
            },
            option3: optionsSchema,
            option4: optionsSchema
        },
        validate: (val) => Object.keys(val).length >= 2 && Object.keys(val).length <= 4
    },
    correctAnswer: {
        type: String,
        required: () => this.quizType === 'QnA'
    },
    submissionCount: {
        type: {
            "option1": {
                type: Number,
                default: 0
            },
            "option2": {
                type: Number,
                default: 0
            },
            "option3": {
                type: Number,
                default: 0
            },
            "option4": {
                type: Number,
                default: 0
            },
        },
        default: () => ({})
    }
})

const quizSchema = mongoose.Schema({
    quizName: {
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
        enum: ['OFF', '5', '10'],
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