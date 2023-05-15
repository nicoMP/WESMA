const express = require("express");
const pool = require("../../db");
const router = express.Router();


router.get('/', async (req, res)=>{
	try{
		const { rows } = await pool.query('SELECT * from trainingsession ');
		res.json(rows)
	}
	catch (err){
		console.log(err);
		res.send(err.detail)
	}
});


// Schedule new training session
router.post("/", async function (req, res) {
	try {
		const session = req.body;
		const { sessionStartTime, sessionEndTime, sessionLocation, sessionCapacity, instructorId, levelId } = session;
		const newSession = await pool.query(`INSERT INTO trainingsession (sessionStartTime, sessionEndTime, sessionlocation, sessioncapacity, instructorid, levelid) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
			[sessionStartTime, sessionEndTime, sessionLocation, sessionCapacity, instructorId, levelId]);
		res.json(newSession.rows)
	} catch (err) {
		console.log(err);
		res.status(409).send(err.detail);
	}
});

// Modify a training session
router.put("/", async function (req, res) {
	// TODO - need a new primary id for the trainingsession table before we can modify entries
	try {
		const session = req.body;
		const { sessionID, sessionStartTime, sessionEndTime, sessionLocation, sessionCapacity, instructorID, levelID } = session;
		const modifiedSession = await pool.query(`UPDATE TrainingSession SET sessionStartTime = $2, sessionEndTime = $3, sessionLocation = $4, sessionCapacity = $5, instructorID = $6, levelID = $7 WHERE sessionID = $1`, [sessionID, sessionStartTime, sessionEndTime, sessionLocation, sessionCapacity, instructorID, levelID]);
		res.json(modifiedSession.rows);
	}
	catch (err) {
		console.log(err);
		res.status(500).send(err.detail);
	}
});

// Delete a training session
router.delete("/", async function (req, res) {
	// TODO - need a new primary id for the trainingsession table before we can delete entries
	try {
		const session = req.body;
		const { sessionID } = session;
		const deletedSession = await pool.query(`DELETE FROM TrainingSession WHERE sessionID = $1`, [sessionID]);
		res.json(deletedSession.rows);
	}
	catch (err) {
		console.log(err);
		res.status(500).send(err.detail);
	}
});

// Enroll in a training session
router.post("/enroll", async function (req, res) {
	try {
		const { studentID, sessionID } = req.body;
		// Check prerequisite modules
		// Get list of prerequisite modules for this session's associated level
		const prereqModules = await pool.query(`SELECT * FROM TrainingPrerequisiteModule WHERE levelID = (SELECT levelID FROM TrainingSession WHERE sessionID = $1)`, [sessionID]);
		for (let prereq of prereqModules.rows) {
			// Skip all of the checks if the prerequisite is optional
			if (prereq.isOptional) {
				continue;
			}
			// Get completions for each module, ordered by completion date (most recent first)
			let completions = await pool.query(`SELECT * FROM StudentModuleCompletion WHERE studentID = $1 AND moduleID = $2 ORDER BY completionDate DESC`, [studentID, prereq.moduleID]);

			// Error if list is empty 
			if (completions.rows.length == 0) {
				res.status(403).send("Cannot enroll: Missing prerequisite module(s)");
				return;
			}

			// Check completion dates against prerequisite valid interval
			let currentDate = new Date();
			let validCompletion = false;

			for (let completion of completions.rows) {
				// Get the date until which the completion is valid
				let completionExpiration = await pool.query(`SELECT $1::timestamp + $2::interval AS expirationDate`, [completion.completionDate, prereq.validInterval]);
				let expirationDate = new Date(completionExpiration.rows[0].expirationDate);
				// Can immediately error and return if an expired completion is found since the list is sorted by date
				if (expirationDate < currentDate) {
					res.status(403).send("Cannot enroll: Prerequisite is expired or received a failing grade");
					return;
				}
				else {
					// Get the passing grde for the module to compare
					let passingGrade = await pool.query(`SELECT * FROM OnlineModule WHERE moduleID = $1`, [completion.moduleID]);
					if (completion.grade == null || completion.grade >= passingGrade.rows[0].modulePassingGrade) {
						// If there's no grade (meaning the module isn't graded) or the grade is passing, continue to the next prerequisite
						validCompletion = true;
						break;
					}
				}
			}
			// If no valid module completion was found, return an error.
			if (!validCompletion)
				res.status(403).send("Cannot enroll: Missing prerequisite module or received a failing grade");
		}
		// If we get here it means the student had a valid (passing, non-expired) completion for every prerequisite module.

		// Check prerequisite levels
		// Get list of prerequisite levels for this session's associated level
		const prereqLevels = await pool.query(`SELECT * FROM TrainingPrerequisiteLevel WHERE levelID = (SELECT levelID FROM TrainingSession WHERE sessionID = $1)`, [sessionID]);
		for (let prereq of prereqLevels.rows) {
			// Skip all of the checks if the prerequisite is optional
			if (prereq.isOptional) {
				continue;
			}

			// Get completions for each level, ordered by completion date (most recent first)
			let completions = await pool.query(`SELECT * FROM StudentLevelCompletion WHERE studentID = $1 AND levelID = $2 ORDER BY completionDate DESC`, [studentID, prereq.prereqLevelID]);

			// Error if list is empty 
			if (completions.rows.length == 0) {
				res.status(403).send("Cannot enroll: Missing prerequisite level(s)");
				return;
			}

			// Check completion dates against prerequisite valid interval
			let currentDate = new Date();
			let validCompletion = false;

			for (let completion of completions.rows) {
				// Get the date until which the completion is valid
				let completionExpiration = await pool.query(`SELECT $1::timestamp + $2::interval AS expirationDate`, [completion.completionDate, prereq.validInterval]);
				let expirationDate = new Date(completionExpiration.rows[0].expirationDate);
				// Can immediately error and return if an expired completion is found since the list is sorted by date
				if (expirationDate < currentDate) {
					res.status(403).send("Cannot enroll: Prerequisite is expired or received a failing grade");
					return;
				}
				// If we reach this point, a non-expired completion was found, so we can continue to the next prerequisite
				validCompletion = true;
				break;
			}
			// If a valid completion was not found, then return an error.
			if (!validCompletion)
				res.status(403).send("Cannot enroll: Missing prerequisite level");
		}
		// If we get here it means the student has a valid (non-expired) completion for every prerequisite level.

		// Check that the session is not full already
		const enrolmentInfo = await pool.query(`SELECT s.sessionID, s.sessionCapacity, COUNT(e.studentID) AS enrolled
        FROM TrainingSession s, TrainingSessionEnrolment e
        WHERE s.sessionID = e.sessionID
        AND s.sessionID = $1
        GROUP BY s.sessionID`, [sessionID]);
		if (enrolmentInfo.rows[0] && (enrolmentInfo.rows[0].sessionCapacity <= enrolmentInfo.rows[0].enrolled)) {
			res.status(403).send("Cannot enroll: Session is full");
			return;
		}

		// If we get here, the student meets all prerequisites and there is space in the session, so allow the enrolment.
		let enrolment = await pool.query(`INSERT INTO TrainingSessionEnrolment VALUES ($1, $2) RETURNING *`, [studentID, sessionID]);
		res.json(enrolment.rows);
	} catch (err) {
		console.log(err);
		res.status(409).send(err.detail);
	}
});

// Confirm that a student attended a given session (to be used by instructors)
router.put('/confirm-attendance', async (req, res) => {
	try {
		const { studentID, sessionID, bool } = req.body;
		console.log( studentID, sessionID, bool);
		let enrolment = await pool.query(`UPDATE TrainingSessionEnrolment SET attendance = true WHERE studentID = $1 AND sessionID = $2`, [studentID, sessionID, bool]);
		res.json(enrolment.rows);
	}
	catch (err) {
		console.log(err);
		res.status(500).send(err.detail);
	}
});

// Remove student from session
// Can be used by both instructors and students
// Instructors would select the student from the list
// Students would not select anything but their id from their session would be used
router.delete("/drop", async function (req, res) {
	try {
		// This can probably use session id in the future
		const { studentId, sessionID } = req.body;
		const removedStudent = await pool.query(`DELETE FROM trainingsessionenrolment WHERE studentid = $1 AND sessionID = $2 RETURNING *`,
			[studentId, sessionID]);
		res.json(removedStudent.rows)
	} catch (err) {
		console.log(err);
		res.status(500).send(err.detail);
	}
});

// Get all enrolled students for a given session
router.get("/enrolled", async function (req, res) {
	try {
		// This can probably use session id in the future
		const { sessionID } = req.query;
		const { rows } = await pool.query('SELECT trainingsessionenrolment.*, student.studentname FROM trainingsessionenrolment JOIN student ON trainingsessionenrolment.studentid = student.studentid WHERE trainingsessionenrolment.sessionid = $1;', [sessionID]);

		res.json(rows);
	} catch (err) {
		console.log(err);
	}
});
router.get('/enrolled/student', async (req, res)=>{
	try{
		const { studentid } = req.query;
		const { rows } = await pool.query('SELECT * FROM trainingsession WHERE sessionid IN (SELECT sessionid FROM trainingsessionenrolment WHERE studentId = $1)', [studentid]);
		res.json(rows)
	}
	catch (err){
		console.log(err);
		res.send(err.detail)
	}
});
// Get all sessions for an instructor (call this in instructor view for an instructor to see their scheduled sessions)
router.get("/instructor", async function (req, res) {
	try {
		const { instructorId } = req.query;
		const { rows } = await pool.query('SELECT * from trainingsession WHERE instructorid = $1', [instructorId]);
		res.json(rows);
	} catch (err) {
		console.log(err);
	}
});

// Get all sessions for a training level
router.get("/level", async function (req, res) {
	try {
		const { levelId } = req.query.id;
		const { rows } = await pool.query('SELECT * from trainingsession WHERE levelId = $1', [levelId]);
		res.json(rows);
	} catch (err) {
		console.log(err);
	}
});

// Get all sessions for a student given their specific training level (call this in student view for a student to see their sessions they can enroll in)
router.get("/student/level", async function (req, res) {
	try {
		const { studentId } = req.query.id;
		const { rows } = await pool.query(
			'SELECT trainingsession.* FROM trainingsession JOIN traininglevel ON traininglevel.levelid = trainingsession.levelid JOIN studentlevelcompletion ON traininglevel.levelid = studentlevelcompletion.levelid WHERE studentid = $1;',
			[studentId]);
		res.json(rows);
	} catch (err) {
		console.log(err);
	}
});

// Get all sessions within the given month not scheduled by the instructor (call this in instructor view to display all sessions within the month so they can ensure they aren't booking into a booked timeslot)
router.get("/all", async function (req, res) {
	try {
		const { instructorId } = req.query.id;
		const { rows } = await pool.query('SELECT * from trainingsession WHERE instructorid != $1', [instructorId]);
		res.json(rows);
	} catch (err) {
		console.log(err);
	}
});

module.exports = router;