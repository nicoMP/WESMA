const express = require("express");
const pool = require("../../db");
const router = express.Router();
const fs = require("fs");

// TODO:
// Add API endpoint to generate the CSV file (once we know how it's formatted)
// 	- When generating the CSV, clean up expired access entries
// Make level completions automatically grant card access (will probably require DB changes)
//	- Either add entries when adding a level completion, or update the list of entries based on the level completion table when generating the CSV

// Machines ===========================================================================
// Get the list of all machines/rooms for card access
router.get("/machines", async (req, res) => {
	try {
		let machines = await pool.query(`SELECT * FROM CardAccessMachine`);
		res.json(machines.rows);
	}
	catch (err) {
		console.log(err);
		res.status(500).send(err.detail);
	}
});

// Add a machine
router.post("/machines", async (req, res) => {
	try {
		const machine = req.body;
		const {machineName} = machine;
		let machines = await pool.query(`INSERT INTO CardAccessMachine(machineName) VALUES ($1) RETURNING *`, [machineName]);
		res.json(machines.rows);
	}
	catch (err) {
		console.log(err);
		res.status(500).send(err.detail);
	}
});

// Modify a machine entry (rename a machine)
router.put("/machines", async (req, res) => {
	try {
		const machine = req.body;
		const { machineID, machineName } = machine;
		let machines = await pool.query(`UPDATE CardAccessMachine SET machineName = $2 WHERE machineID = $1 RETURNING *`, [machineID, machineName]);
		res.json(machines.rows);
	}
	catch (err) {
		console.log(err);
		res.status(500).send(err.detail);
	}
});

// Delete a machine
router.delete("/machines", async (req, res) => {
	try {
		const machine = req.body;
		const { machineID } = machine;
		let machines = await pool.query(`DELETE FROM CardAccessMachine WHERE machineID = $1`, [machineID]);
		res.json(machines.rows);
	}
	catch (err) {
		console.log(err);
		res.status(500).send(err.detail);
	}
});

// Entries ==============================================================
// Get all access entries
router.get("/", async (req, res) => {
	try {
		let entries = await pool.query(`SELECT * FROM CardAccessEntry`);
		res.json(entries.rows);
	}
	catch (err) {
		console.log(err);
		res.status(500).send(err.detail);
	}
});

// Get all access entries for a given machine
router.get("/entries-by-machine", async (req, res) => {
	try {
		const machine = req.body;
		const { machineID } = machine;
		let entries = await pool.query(`SELECT * FROM CardAccessEntry WHERE machineID = $1`, [machineID]);
		res.json(entries.rows);
	}
	catch (err) {
		console.log(err);
		res.status(500).send(err.detail);
	}
});

// Get all access entries for a given student
router.get("/entries-by-student", async (req, res) => {
	try {
		const student = req.body;
		const { studentID } = student;
		let entries = await pool.query(`SELECT * FROM CardAccessEntry WHERE studentID = $1`, [studentID]);
		res.json(entries.rows);
	}
	catch (err) {
		console.log(err);
		res.status(500).send(err.detail);
	}
});

// Add an access entry
router.post("/", async (req, res) => {
	try {
		const entry = req.body;
		const { studentID, machineID, expirationDate } = entry;
		let newEntry = await pool.query(`INSERT INTO CardAccessEntry(studentID, machineID, expirationDate) VALUES ($1, $2, $3) RETURNING *`, [studentID, machineID, expirationDate]);
		res.json(newEntry.rows);
	}
	catch (err) {
		console.log(err);
		res.status(500).send(err.detail);
	}
});

// Modify an access entry
router.put("/", async (req, res) => {
	try {
		const entry = req.body;
		const { entryID, studentID, machineID, expirationDate } = entry;
		let modifiedEntry = await pool.query(`UPDATE CardAccessEntry SET studentID = $2, machineID = $3, expirationDate = $4 WHERE entryID = $1 RETURNING *`, [entryID, studentID, machineID, expirationDate]);
		res.json(modifiedEntry.rows);
	}
	catch (err) {
		console.log(err);
		res.status(500).send(err.detail);
	}
});

// Delete an access entry
router.delete("/", async (req, res) => {
	try {
		const entry = req.body;
		const { entryID } = entry;
		let deletedEntry = await pool.query(`DELETE FROM CardAccessEntry WHERE entryID = $1 RETURNING *`, [entryID]);
		res.json(deletedEntry.rows);
	}
	catch (err) {
		console.log(err);
		res.status(500).send(err.detail);
	}
});

// Clean up expired card access entries
router.delete("/cleanup", async (req, res) => {
	try{
		let deletedEntries = await pool.query(`DELETE FROM CardAccessEntry WHERE expirationDate < CURRENT_TIMESTAMP RETURNING *`);
		res.json(deletedEntries.rows);
	}
	catch (err){
		console.log(err);
		res.status(500).send(err.detail);
	}
});

// Export card access list as CSV
router.get("/export", async (req, res) => {
	try {
		// Get all non-expired entries
		let entries = (await pool.query(`SELECT * FROM CardAccessEntry WHERE expirationDate >= CURRENT_TIMESTAMP`)).rows;
		// Get all unique student IDs from the entries table
		let studentIDs = (await pool.query(`SELECT DISTINCT studentID FROM CardAccessEntry WHERE expirationDate >= CURRENT_TIMESTAMP`)).rows;
		
		let csvContent = ``;

		// For each unique student ID, create a CSV row containing the student ID and all machine IDs for which they have access
		for (let row of studentIDs){
			let id = row.studentID;
			let csvRow = `${id}`;
			for (let entry of entries){
				if (entry.studentID == id)
					csvRow += `,${entry.machineID}`;
			}
			csvContent += `${csvRow}\n`;
		}

		// Create the CSV file
		fs.writeFileSync(`temp.csv`, csvContent.trim());
		res.sendFile('temp.csv');

	}
	catch (err) {
		console.log(err);
		res.status(500).send(err.detail);
	}
});

module.exports = router;