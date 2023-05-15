--	Get all prerequisite modules for the level associated with a given session (sessionID = $1)
SELECT * FROM TrainingPrerequisiteModule
	WHERE levelID = (SELECT levelID FROM TrainingSession WHERE sessionID = $1);

-- Get all of a given student's completions of a given module, most recent first (studentID = $1, moduleID = $2)
SELECT * FROM StudentModuleCompletion
	WHERE studentID = $1
	AND moduleID = $2
	ORDER BY completionDate DESC;

-- Get a session's capacity and the number of students currently enrolled
SELECT s.sessionID, s.sessionCapacity, COUNT(e.studentID) AS enrolled
	FROM TrainingSession s, TrainingSessionEnrolment e
	WHERE s.sessionID = e.sessionID
	AND s.sessionID = s.sessionID
	GROUP BY s.sessionID;