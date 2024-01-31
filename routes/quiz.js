const express = require('express')
const router = express.Router()

const Quiz = require('../models/quiz')

const errorHandler = (res, error) => {
    res.status(500).json({
        status: "Failed",
        error: "Internal server error."
    })
}

// for creating a quiz
router.post('/create', async (req, res) => {
    try {
        const { quizName, quizType, timer, createdBy, questions } = req.body
        const createdQuiz = await Quiz.create({ quizName, quizType, timer, createdBy, questions })
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
router.get('/', async (req, res) => {
    try {
        const { createdby, sortcondition } = req.headers
        const quizs = sortcondition ?
            await Quiz.find({ createdBy: createdby }).sort(JSON.parse(sortcondition))
            : await Quiz.find({ createdBy: createdby })
        res.json({
            status: "Success",
            quizs
        })
    } catch (error) {
        errorHandler(res, error)
    }
})

// for delete quiz
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const quiz = await Quiz.findOne({ _id: id })
        if (!quiz) {
            return res.json({
                status: "Failed",
                message: "Quiz does not exists."
            })
        }
        await Quiz.deleteOne({ _id: id })
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
        // console.log(quiz.questions)
        let score = 0

        // increasing count of which option is selected for each question
        quiz.questions.forEach((question, idx) => {
            const questionId = question.id
            const selectedOption = submittedAnswers[questionId]
            // console.log(selectedOption)
            // console.log(quiz.questions[idx].submissionCount[selectedOption])
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
router.get('/analysis/:id', async (req, res) => {
    try {
        const { createdby } = req.headers
        const { id } = req.params
        const quiz = await Quiz.findOne({ createdBy: createdby, _id: id })
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
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { createdby } = req.headers
        const { questions, timer } = req.body
        const quiz = await Quiz.findOne({ _id: id, createdBy: createdby })
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