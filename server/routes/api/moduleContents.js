const express = require("express");
const pool = require("../../db");
const router = express.Router();

// Module contents
// TODO: Html contents should be able to have a parent page

// Create new resources
// Create a multimedia item
router.post("/multimedia", async function (req, res) {
	try{
		const moduleContent = req.body;
		const {contentName, contentLocation, mediaType, moduleID} = moduleContent;
		const newContent = await pool.query(`INSERT INTO ModuleContentMultimedia(contentName, contentLocation, mediaType, moduleID) VALUES ($1, $2, $3, $4) RETURNING *`, [contentName, contentLocation, mediaType, moduleID]);
		res.json(newContent.rows);
	}
	catch (err){
		console.log(err);
		res.status(409).send(err.detail);
	}
});

// Create an HTML page
// TODO: Do this automatically when creating a module
router.post("/html", async function (req, res) {
	try{
		const moduleContent = req.body;
		const {contentName, html, isMainPage, canGoBack, moduleID} = moduleContent;
		const newContent = await pool.query(`INSERT INTO ModuleContentHTML(contentName, html, isMainPage, canGoBack, moduleID) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [contentName, html, isMainPage, canGoBack, moduleID]);
		res.json(newContent.rows);
	}
	catch (err){
		console.log(err);
		res.status(409).send(err.detail);
	}
});

// Create a quiz
router.post("/quiz", async function (req, res) {
	try{
		const moduleContent = req.body;
		let {quizName, quizContent, isGraded, moduleID} = moduleContent;
        quizContent = JSON.stringify(quizContent);
		const newModule = await pool.query(`INSERT INTO ModuleContentQuiz VALUES (gen_random_uuid(), $1, $2, $3, $4) RETURNING *`, [quizName, quizContent, isGraded, moduleID]);
		res.json(newModule.rows);
	}
	catch (err){
		console.log(err);
		res.status(409).send(err.detail);
	}
});

// Modify resources (module ID does not change)
// Modify a multimedia item
router.put("/multimedia", async function (req, res) {
	try{
		const moduleContent = req.body;
		const {contentID, contentName, contentLocation, mediaType} = moduleContent;
		const updatedContent = await pool.query(`UPDATE ModuleContentMultimedia SET contentName = $2, contentLocation = $3, mediaType = $4 WHERE contentID = $1`, [contentID, contentName, contentLocation, mediaType]);
		res.json(updatedContent.rows);
	}
	catch (err){
		console.log(err);
		res.status(409).send(err.detail);
	}
});

// Modify an HTML page
router.put("/html", async function (req, res) {
	try{
		const moduleContent = req.body;
		const {contentID, contentName, html, isMainPage, canGoBack} = moduleContent;
		const updatedContent = await pool.query(`UPDATE ModuleContentHTML SET contentName = $2, html = $3, isMainPage = $4, canGoBack = $5 WHERE contentID = $1`, [contentID, contentName, html, isMainPage, canGoBack]);
		res.json(updatedContent.rows);
	}
	catch (err){
		console.log(err);
		res.status(409).send(err.detail);
	}
});

// Modify a quiz
router.put("/quiz", async function (req, res) {
	try{
		const moduleContent = req.body;
		let {quizName, quizContent, isGraded, contentId} = moduleContent;
        quizContent = JSON.stringify(quizContent);
		const updatedContent = await pool.query(`UPDATE ModuleContentQuiz SET contentname = $2, quizcontent = $3, isgraded = $4 WHERE contentid = $1`, [contentId, quizName, quizContent, isGraded]);
		res.json(updatedContent.rows);
	}
	catch (err){
		console.log(err);
		res.status(409).send(err.detail);
	}
});

// Delete module contents
// Delete a multimedia item
router.delete("/multimedia/:id", async function (req, res) {
    try {
        const moduleContent = req.params.id;
        const deletedContent = await pool.query(`DELETE FROM ModuleContentMultimedia WHERE contentID = $1`, [moduleContent]);
        res.json(deletedContent.rows);
    }
    catch (err){
        console.log(err);
        res.status(500).send(err.detail);
    }
});

// Delete an HTML page
// TODO: Delete all contents or the module itself if the page being deleted is the main page
router.delete("/html", async function (req, res) {
    try {
        const moduleContent = req.query.id;
        const {contentID} = moduleContent;
        const deletedContent = await pool.query(`DELETE FROM ModuleContentHTML WHERE contentID = $1`, [contentID]);
        res.json(deletedContent.rows);
    }
    catch (err){
        console.log(err);
        res.status(500).send(err.detail);
    }
});

// Delete a quiz
router.delete("/quiz", async function (req, res) {
    try {
        const moduleContent = req.query.id;
        const {contentID} = moduleContent;
        const deletedContent = await pool.query(`DELETE FROM ModuleContentQuiz WHERE contentID = $1`, [contentID]);
        res.json(deletedContent.rows);
    }
    catch (err){
        console.log(err);
        res.status(500).send(err.detail);
    }
});

// Get all contents associated with a given module
// Multimedia contents
router.get("/multimedia/:id", async function (req, res) {
    try {
        const mod = req.params.id;
        const contents = await pool.query(`SELECT * FROM ModuleContentMultimedia WHERE moduleID = $1`, [mod]);
        res.json(contents.rows);
    }
    catch (err){
        console.log(err);
        res.status(500).send(err.detail);
    }
});

// HTML contents
router.get("/html", async function (req, res) {
    try {
        const mod = req.query.id;
        const {moduleID} = mod;
        const contents = await pool.query(`SELECT * FROM ModuleContentHTML WHERE moduleID = $1`, [moduleID]);
        res.json(contents.rows);
    }
    catch (err){
        console.log(err);
        res.status(500).send(err.detail);
    }
});

// All quiz contents for instructor
router.get("/instructor/quiz/:moduleId", async function (req, res) {
    try {
        const contents = await pool.query(`SELECT * FROM ModuleContentQuiz WHERE moduleID = $1 ORDER BY contentname`, [req.params.moduleId]);
        res.json(contents.rows);
    }
    catch (err){
        console.log(err);
        res.status(500).send(err.detail);
    }
});

// Quiz content for instructor given quiz id and module id
router.get("/instructor/singlequiz/:moduleId/:quizId", async function (req, res) {
    try {
        const contents = await pool.query(`SELECT contentname, quizcontent, isgraded FROM ModuleContentQuiz WHERE moduleID = $1 AND contentId = $2`, [req.params.moduleId, req.params.quizId]);
        res.json(contents.rows);
    }
    catch (err){
        console.log(err);
        res.status(500).send(err.detail);
    }
});

// Retrieve all quizzes for students for given module
router.get("/student/quiz/:moduleId", async function (req, res) {
    try {
        const contents = await pool.query(`SELECT contentid, contentname, moduleid FROM ModuleContentQuiz WHERE moduleID = $1 ORDER BY contentname`, [req.params.moduleId]);
        res.json(contents.rows);
    }
    catch (err){
        console.log(err);
        res.status(500).send(err.detail);
    }
});

// Retrieve quiz questions for students without answers
router.get("/student/quiz-questions/:moduleId/:quizId", async function (req, res) {
    try {
        const response = (await pool.query(`SELECT * FROM ModuleContentQuiz WHERE moduleID = $1 AND contentID = $2`, [req.params.moduleId, req.params.quizId])).rows[0];
        for (let question of response.quizcontent) {
            delete question.answer;
        }
        res.json(response);
    }
    catch (err){
        console.log(err);
        res.status(500).send(err.detail);
    }
});

module.exports = router;
