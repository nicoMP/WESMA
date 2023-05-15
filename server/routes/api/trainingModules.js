const express = require("express");
const pool = require("../../db");
const router = express.Router();
const auth = require('../../middleware/auth');

// Create a module
router.post("/", async function (req, res) {
	try{
		const onlineModule = req.body;
		const {moduleName, moduleDesc, modulePassingGrade, instructorID} = onlineModule;
		const newModule = await pool.query(`INSERT INTO OnlineModule(moduleName, moduleDescription, modulePassingGrade, instructorID) VALUES ($1, $2, $3, $4) RETURNING *`, [moduleName, moduleDesc, modulePassingGrade, instructorID]);
		res.json(newModule.rows);
	}
	catch (err){
		console.log(err);
		res.status(409).send(err.detail);
	}
});

// Update a module
router.put("/", async function (req, res) {
    try {
        const onlineModule = req.body;
        const {moduleID, moduleName, moduleDesc, modulePassingGrade, instructorID} = onlineModule;
        const modifiedModule = await pool.query(`UPDATE OnlineModule SET moduleName = $2, moduleDescription = $3, modulePassingGrade = $4, instructorID = $5 WHERE sessionID = $1`, [moduleID, moduleName, moduleDesc, modulePassingGrade, instructorID]);
        res.json(modifiedModule.rows);
    }
    catch (err){
        console.log(err);
        res.status(500).send(err.detail);
    }
});

// Delete a module
router.delete("/:id", async function (req, res) {
    try {
        const moduleID = req.params.id;
        const deletedModule = await pool.query(`DELETE FROM OnlineModule WHERE moduleid = $1`, [moduleID]);
        res.json(deletedModule.rows);
    }
    catch (err){
        console.log(err);
        res.status(500).send(err.detail);
    }
});


// Complete a module (completion timestamp is always the current date and time)
router.post("/complete", async function (req, res) {
	try{
		const completion = req.body;
		const {studentID, moduleID} = completion;
		// Get all of the student's quiz attempts for this module
		// Get all quizzes in the module
		let quizzes = (await pool.query(`SELECT contentID FROM ModuleContentQuiz WHERE moduleID = $1`, [moduleID])).rows;
		let quizGrades = [];
		for (let quiz of quizzes){
			if (!quiz.isGraded) continue;	// Skip non-graded quizzes
			// Get all attempts for the quiz, most recent first
			let attempts = (await pool.query(`SELECT * FROM QuizCompletion WHERE studentID = $1 AND quizID = $2 ORDER BY attemptDate DESC`, [studentID, quiz.quizID])).rows;
			if (attempts[0]){
				// Push the grade of the most recent attempt to the array, then move on to the next quiz
				quizGrades.push(attempts[0].grade);
				continue;
			}
			else{
				// If there are no attempts, return an error
				// TODO: optional quizzes, check that attempt date is reasonably recent?
				res.status(403).send("Cannot complete module: Missing required quiz");
				return;
			}
		}
		// Take the average of the quiz grades for the module completion grade
		// TODO: make it a weighted average by assigning a total marks value to each quiz?
		let finalGrade = quizGrades.reduce((prev, curr) => prev + curr, 0) / quizGrades.length;

		let completionDate = new Date().toISOString();	// YYYY-MM-DDTHH:MM:SSZ
		const newCompletion = await pool.query(`INSERT INTO StudentModuleCompletion VALUES ($1, $2, $3, $4)`, [studentID, moduleID, finalGrade, completionDate]);
		res.json(newCompletion.rows);
	}
	catch (err){
		console.log(err);
		res.status(500).send(err.detail);
	}
});

// Get module completions by module ID
router.get("completions-by-module", async function (req, res) {
	try{
		const mod = req.query.id;
		const {moduleID} = mod;
		let completions = await pool.query(`SELECT * FROM StudentModuleCompletion WHERE moduleID = $1`, [moduleID]);
		res.json(completions.rows);
	}
	catch (err){
		console.log(err);
		res.status(500).send(err);
	}
});

// Get module completions by student ID
router.get("completions-by-student", async function (req, res) {
	try{
		const student = req.query.id;
		const {studentID} = student;
		let completions = await pool.query(`SELECT * FROM StudentModuleCompletion WHERE studentID = $1`, [studentID]);
		res.json(completions.rows);
	}
	catch (err){
		console.log(err);
		res.status(500).send(err);
	}
});

// Do we need to update or delete completion data? Seems like it would be useful to permanently store this info
// (in order to see all of a user's previous attempts, grade improvements over time, etc.)

// Assign a prerequisite module to a level
router.post("/prerequisite-module", async function (req, res) {
	try{
		const prereq = req.body;
		const {levelID, moduleID, isOptional, timeBeforeSession, validInterval} = prereq;
		const newPrereq = await pool.query(`INSERT INTO TrainingPrerequisiteModule VALUES ($1, $2, $3, $4, $5)`, [levelID, moduleID, isOptional, timeBeforeSession, validInterval]);
		res.json(newPrereq.rows);
	}
	catch (err){
		console.log(err);
		res.status(500).send(err.detail);
	}
});

// Modify a prerequisite module
router.put("/prerequisite-module", async function (req, res) {
	try{
		const prereq = req.body;
		const {levelID, moduleID, isOptional, timeBeforeSession, validInterval} = prereq;
		const modifiedPrereq = await pool.query(`UPDATE TrainingPrerequisiteModule SET isOptional = $3, timeBeforeSession = $4, validInterval = $5 WHERE levelID = $1 AND moduleID = $2`, [levelID, moduleID, isOptional, timeBeforeSession, validInterval]);
		res.json(modifiedPrereq.rows);
	}
	catch (err){
		console.log(err);
		res.status(500).send(err.detail);
	}
});

// Delete a prerequisite module
router.delete("/prerequisite-module", async function (req, res) {
    try {
        const prereq = req.query.id;
        const {levelID, moduleID} = prereq;
        const deletedPrereq = await pool.query(`DELETE FROM TrainingPrerequisiteModule WHERE levelID = $1 AND moduleID = $2`, [levelID, moduleID]);
        res.json(deletedPrereq.rows);
    }
    catch (err){
        console.log(err);
        res.status(500).send(err.detail);
    }
});

// Get all prerequisite modules for a given level
router.get("/prerequisite-modules-for-level", async function (req, res){
	try{
		const mod = req.query.id;
		const {levelID} = level;
		const prereqs = await pool.query(`SELECT * FROM TrainingPrerequisiteModule WHERE levelID = $1`, [levelID]);
		res.json(prereqs.rows);
	}
	catch (err) {
		console.log(err);
		res.status(500).send(err.detail);
	}
});


// Assign a prerequisite level to a level
router.post("/prerequisite-level", async function (req, res) {
	try{
		const prereq = req.body;
		const {levelID, prereqLevelID, isOptional, timeBeforeSession, validInterval} = prereq;
		const newPrereq = await pool.query(`INSERT INTO TrainingPrerequisiteLevel VALUES ($1, $2, $3, $4, $5)`, [levelID, prereqLevelID, isOptional, timeBeforeSession, validInterval]);
		res.json(newPrereq.rows);
	}
	catch (err){
		console.log(err);
		res.status(500).send(err.detail);
	}
});

// Modify a prerequisite level
router.put("/prerequisite-level", async function (req, res) {
	try{
		const prereq = req.body;
		const {levelID, prereqLevelID, isOptional, timeBeforeSession, validInterval} = prereq;
		const modifiedPrereq = await pool.query(`UPDATE TrainingPrerequisiteLevel SET isOptional = $3, timeBeforeSession = $4, validInterval = $5 WHERE levelID = $1 AND prereqLevelID = $2`, [levelID, prereqLevelID, isOptional, timeBeforeSession, validInterval]);
		res.json(modifiedPrereq.rows);
	}
	catch (err){
		console.log(err);
		res.status(500).send(err.detail);
	}
});

// Delete a prerequisite level
router.delete("/prerequisite-level", async function (req, res) {
    try {
        const prereq = req.body;
        const {levelID, prereqLevelID} = prereq;
        const deletedPrereq = await pool.query(`DELETE FROM TrainingPrerequisiteModule WHERE levelID = $1 AND prereqLevelID = $2`, [levelID, prereqLevelID]);
        res.json(deletedPrereq.rows);
    }
    catch (err){
        console.log(err);
        res.status(500).send(err.detail);
    }
});

// Get all prerequisite levels for a given level
router.get("/prerequisite-levels-for-level", async function (req, res){
	try{
		const level = req.body;
		const {levelID} = level;
		const prereqs = await pool.query(`SELECT * FROM TrainingPrerequisiteLevel WHERE levelID = $1`, [levelID]);
		res.json(prereqs.rows);
	}
	catch (err) {
		console.log(err);
		res.status(500).send(err.detail);
	}
});

// Get all modules made by a given instructor
router.get("/instructor", auth, async function (req, res) {
    try {
        const instructorID = req.user.id;
		console.log(instructorID);
        const modules = await pool.query(`SELECT * FROM OnlineModule WHERE instructorID = $1`, [instructorID]);
		res.json(modules.rows);
    }
    catch (err){
        console.log(err);
        res.status(500).send(err.detail);
    }
});

// Get all modules
router.get("/", async function (req, res) {
    try {
        const modules = await pool.query(`SELECT * FROM OnlineModule`);
		res.json(modules.rows);
    }
    catch (err){
        console.log(err);
        res.status(500).send(err.detail);
    }
});

// Get a module by a given module id
router.get("/:id", async function (req, res) {
    try {
		const moduleID = req.params.id
        const modules = await pool.query(`SELECT * FROM OnlineModule WHERE moduleid = $1`, [moduleID]);
		res.json(modules.rows);
    }
    catch (err){
        console.log(err);
        res.status(500).send(err.detail);
    }
});

module.exports = router;