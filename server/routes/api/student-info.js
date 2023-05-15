const express = require('express');
const pool = require('../../db.js');
const router = express.Router();

// Add new student
router.post('/', async function (req, res) {
	try {
		const students = req.body;
		const newStudents = [];
		for (let student of students) {
			const {studentNum, studentName, studentProgram, studentYear} = student;
			const newStudent = await pool.query(`INSERT INTO Student(studentNumber, studentName, studentProgram, studentYear) VALUES ($1, $2, $3, $4) RETURNING *`, [studentNum, studentName, studentProgram, studentYear]);
			newStudents.push(newStudent);
		}
		res.json(newStudents);
	}
	catch (err) {
		console.log(err.detail);
		res.status(409).send(err.detail);
	}
});

// Get all students
router.get('/', async function (req, res) {
	try {
		const { rows } = await pool.query("SELECT * FROM Student");
		res.json(rows);
	}
	catch (err) {
		console.log(err);
		res.status(500).send(err.detail);
	}
});

// Update student info
router.put("/", async function (req, res) {
	try {
		const students = req.body;
		const updatedStudents = [];

		for (let student of students) {
			const { studentID, studentNum, studentName, studentProgram, studentYear} = student;
			const updatedStudent = await pool.query(
				`Update Student SET studentNumber = $2, studentName = $3, studentProgram = $4, studentYear = $5 WHERE studentID = $1 RETURNING *`,
				[studentID, studentNum, studentName, studentProgram, studentYear]
			);
			if (updatedStudent.rows[0]) {
				updatedStudents.push(updatedStudent.rows[0]);
			}
		}
		console.log(updatedStudents.length);
		updatedStudents.length > 0 ? res.json(updatedStudents) : res.status(404).send("Student ID not found");
	} catch (err) {
		console.log(err);
		res.status(500).send(err.detail);
	}
});

// Delete student info
router.delete('/', async function (req, res) {
	try{
		const studentIDs = req.query.id;
		const deletedStudents = [];
		for (let id of studentIDs){
			const {studentID} = id;
			const deletedStudent = await pool.query(`DELETE FROM Student WHERE studentID = $1 RETURNING *`, [studentID]);
			if (deletedStudent.rows[0])
				deletedStudents.push(deletedStudent);
		}
		deletedStudents.length > 0 ? res.status(200).send(`Successfully deleted ${deletedStudents.length} students`) : res.status(404).send("Student ID not found");
	}
	catch (err){
		console.log(err);
		res.status(500).send(err.detail);
	}
});

module.exports = router;
