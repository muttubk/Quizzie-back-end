const express = require('express')
const router = express.Router()

const Quiz = require('../models/quiz')
const isLoggedIn = require('../middlewares/requestAuth')

const errorHandler = (res, error) => {
    res.status(500).json({
        status: "Failed",
        error: "Internal server error."
    })
}

// for creating a quiz
router.post('/create', isLoggedIn, async (req, res) => {
    try {
        const user = req.user
        const { quizName, quizType, timer, questions } = req.body
        const createdQuiz = await Quiz.create({ quizName, quizType, timer, createdBy: user, questions })
        res.status(200).json({
            status: "Success",
            message: "Quiz created successfully.",
            id: createdQuiz._id
        })
    } catch (error) {
        errorHandler(res, error)
    }
})

// get all quizs
router.get('/', isLoggedIn, async (req, res) => {
    try {
        const user = req.user
        const { sortcondition } = req.headers
        const quizs = sortcondition ?
            await Quiz.find({ createdBy: user }).sort(JSON.parse(sortcondition))
            : await Quiz.find({ createdBy: user })
        res.json({
            status: "Success",
            quizs
        })
    } catch (error) {
        errorHandler(res, error)
    }
})

// for delete quiz
router.delete('/:id', isLoggedIn, async (req, res) => {
    try {
        const user = req.user
        const { id } = req.params
        const quiz = await Quiz.findOne({ _id: id, createdBy: user })
        if (!quiz) {
            return res.json({
                status: "Failed",
                message: "Quiz does not exists."
            })
        }
        await Quiz.deleteOne({ _id: id, createdBy: user })
        res.json({
            status: "Success",
            message: "Deleted quiz successfully."
        })
    } catch (error) {
        errorHandler(res, error)
    }
})

// for quiz details and impressions, on quiz open
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const quiz = await Quiz.findOne({ _id: id })
        if (!quiz) {
            return res.status(400).json({
                status: "Failed",
                error: "Quiz does not exists."
            })
        }

        // increase impression
        quiz.impressions += 1
        const newquizdata = await quiz.save()

        res.status(200).json({
            status: "Success",
            message: "Successfully fetched quiz details.",
            quizData: newquizdata
        })
    } catch (error) {
        errorHandler(res, error)
    }
})


// quiz submission
router.patch('/submit/:id', async (req, res) => {
    try {
        const { id } = req.params
        const quiz = await Quiz.findOne({ _id: id })
        if (!quiz) {
            return res.json({
                status: "Failed",
                error: "Quiz does not exixts."
            })
        }

        const { submittedAnswers } = req.body
        let score = 0

        // increasing count of which option is selected for each question
        quiz.questions.forEach((question, idx) => {
            const questionId = question.id
            const selectedOption = submittedAnswers[questionId]
            if (question.correctAnswer === selectedOption) {
                score++
            }
            quiz.questions[idx].submissionCount[selectedOption] += 1
        })
        const newdata = await quiz.save()

        res.status(200).json({
            status: "Success",
            message: "Submitted quiz successfully.",
            score,
            // newdata
        })
    } catch (error) {
        errorHandler(res, error)
    }
})

// get quiz details for analysis
router.get('/analysis/:id', isLoggedIn, async (req, res) => {
    try {
        const user = req.user
        const { id } = req.params
        const quiz = await Quiz.findOne({ createdBy: user, _id: id })
        if (!quiz) {
            return res.json({
                status: "Failed",
                error: "Quiz does not exist"
            })
        }
        res.json({
            status: "Success",
            quiz
        })
    } catch (error) {
        errorHandler(res, error)
    }
})

// edit/update quiz
router.patch('/:id', isLoggedIn, async (req, res) => {
    try {
        const user = req.user
        const { id } = req.params
        const { questions, timer } = req.body
        const quiz = await Quiz.findOne({ _id: id, createdBy: user })
        if (!quiz) {
            return res.json({
                status: "Failed",
                error: "Quiz does not exist"
            })
        }
        const updatedQuiz = await Quiz.findOneAndUpdate({ _id: id }, { questions, timer }, {
            new: true
        })
        if (updatedQuiz) {
            res.json({
                status: "Success",
                message: "Updated quiz successfully",
                updatedQuiz
            })
        }
        else {
            res.json({
                status: "Failed",
                error: "Something went wrong"
            })
        }
    } catch (error) {
        errorHandler(res, error)
    }
})

module.exports = router