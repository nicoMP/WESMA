const express = require("express");
const pool = require("../../db");
const router = express.Router();

// Get all attempts for a given quiz
router.get("/attempts/quiz", async function (req, res) {
    try {
        const quiz = req.query.id;
        const {quizID} = quiz;
        const attempts = await pool.query(`SELECT * FROM QuizAttempt WHERE quizID = $1`, [quizID]);
        res.json(attempts.rows);
    }
    catch (err){
        console.log(err);
        res.status(500).send(err.detail);
    }
});

// Get all attempts for a given module
router.get("/attempts/module", async function (req, res) {
    try {
        const mod = req.query;
        const {modID} = mod;
        const attempts = await pool.query(`SELECT ModuleContentQuiz.contentname, QuizAttempt.grade, QuizAttempt.attemptdate, student.studentname, student.studentnumber FROM QuizAttempt JOIN ModuleContentQuiz ON QuizAttempt.quizID = ModuleContentQuiz.contentID JOIN student on QuizAttempt.studentid = student.studentid WHERE moduleID = $1`, [modID]);
        res.json(attempts.rows);
    }
    catch (err){
        console.log(err);
        res.status(500).send(err.detail);
    }
});

// Get all attempts for a given module for each student
router.get("/student-attempts", async function (req, res) {
    try {
        const params = req.query;
        const {modID, studentID} = params;
        const attempts = await pool.query(`SELECT ModuleContentQuiz.contentname, QuizAttempt.grade, QuizAttempt.attemptdate FROM QuizAttempt JOIN ModuleContentQuiz ON QuizAttempt.quizID = ModuleContentQuiz.contentID WHERE moduleID = $1 AND QuizAttempt.studentID = $2`, [modID, studentID]);
        res.json(attempts.rows);
    }
    catch (err){
        console.log(err);
        res.status(500).send(err.detail);
    }
});

// Auto-grading
// Take inputs of answers and quiz from front end
// Grades the quiz based on DB answer key and the provided answers
// Saves grade to student grades table? Might need a new table for this since Duane wants grade tracking
// Sample of JSON input from client
/*
{
   "quizID" : "1",
   "studentID" : "1",
   "moduleID": "1",
   "results" : [
       {
            "question": "test q 1",
            "questionType": "multi-choice-mc",
            "studentAnswer": ["c1", "c2"]
        },
        {
            "question": "test q 2",
            "questionType": "single-choice-mc",
            "studentAnswer": "c1"
        }
    ]
}
*/
router.post("/grade", async function (req, res) {
	try{
        const body = req.body;
        const { quizID, studentID, moduleID, results } = body;
        const { quizcontent } = (await pool.query(`SELECT quizContent FROM ModuleContentQuiz WHERE moduleID = $1 AND contentID = $2`, [moduleID, quizID])).rows[0];
        let score = 0; 
        let totalMarks = 0;
        for (let question of quizcontent) {
            totalMarks += (question.marks*1);
            for (let result of results) {
                if (result.question === question.question && result.questionType === question.type) {
                    switch (question.type) {
                        case 'single-choice-mc':
                            if (result.studentAnswer === question.answer) {
                                score += (question.marks*1);
                            }
                            break;
                        case 'multi-choice-mc':
                            if (arrayEquals(result.studentAnswer, question.answer)) {
                                score += (question.marks*1);
                            }
                            break;
                        default:
                            break;
                    }
                }
            }
        }

        // Create a new quiz attempt entry
        let grade = (totalMarks == 0 ? 0 : score / totalMarks)*100;
        const quizAttempt = (await pool.query(`INSERT INTO QuizAttempt (studentID, quizID, grade, attemptDate) VALUES ($1, $2, $3, $4) RETURNING *`, [studentID, quizID, grade, (new Date()).toISOString()]));
        
        // Attempt to complete module
        let quizzes = (await pool.query(`SELECT * FROM ModuleContentQuiz WHERE moduleID = $1`, [moduleID])).rows;
		let quizGrades = [];
        let completeModule = true;
		for (let quiz of quizzes){
			if (!quiz.isgraded) continue;	// Skip non-graded quizzes
			// Get all attempts for the quiz, most recent first
			let attempts = (await pool.query(`SELECT * FROM QuizAttempt WHERE studentID = $1 AND quizID = $2 ORDER BY grade DESC`, [studentID, quiz.contentid])).rows;
			if (attempts[0]){
				// Push the highest grade of the quiz to the array, then move on to the next quiz
				quizGrades.push(attempts[0].grade);
				continue;
			}
			else{
				completeModule = false;
                break;
			}
		}
        if (completeModule) {
            // Take the average of the quiz grades for the module completion grade
            let finalGrade = quizGrades.reduce((prev, curr) => prev + curr, 0) / quizGrades.length;

            let completionDate = new Date().toISOString();	// YYYY-MM-DDTHH:MM:SSZ
            const newCompletion = await pool.query(`INSERT INTO StudentModuleCompletion VALUES ($1, $2, $3, $4)`, [studentID, moduleID, finalGrade, completionDate]);
        }
        res.status(200).send(quizAttempt.rows);
	}
	catch (err){
		console.log(err);
		res.status(409).send(err.detail);
	}
});

function arrayEquals(a, b) {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length == b.length &&
        a.every((val, index) => val == b[index]);
}

module.exports = router;