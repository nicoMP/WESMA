const express = require("express");
const pool = require("../../db");
const router = express.Router();

//Add new exercise
router.post("/", async function (req, res) {
  try {
    const exercises = req.body;
    const newExercises = [];
    for (let exercise of exercises) {
      const { exerciseName, exerciseDescription } = exercise;
      const newExercise = await pool.query(
        `INSERT INTO exercise(exerciseName, exerciseDescription) VALUES ($1, $2) RETURNING *`,
        [exerciseName, exerciseDescription]
      );
      newExercises.push(newExercise.rows[0]);
    }
    res.json(newExercises);
  } catch (err) {
    console.log(err);
    res.status(409).send(err.detail);
  }
});

//Delete an exercise
router.delete("/", async function (req, res) {
  try {
    const exerciseIDs = req.body;
    const deletedExercises = [];
    for (let id of exerciseIDs) {
      const { exerciseID } = id;
      const deletedExercise = await pool.query(
        `DELETE FROM exercise WHERE exerciseid = $1 RETURNING *`,
        [exerciseID]
      );
      if (deletedExercise.rows[0]) deletedExercises.push(deletedExercise);
    }
    //Handling record not found this way since it doesnt catch error if the record is not found
    deletedExercises.length > 0
      ? res.status(200).send("DELETED")
      : res.status(404).send("exercise id not found");
  } catch (err) {
    console.log(err);
    res.status(500).send(err.detail);
  }
});

//Update exercise
router.put("/", async function (req, res) {
  try {
    const exercises = req.body;
    const updatedExercises = [];

    for (let exercise of exercises) {
      const { exerciseID, exerciseName, exerciseDescription } = exercise;
      const updatedExercise = await pool.query(
        `Update exercise SET exerciseName = $2, exerciseDescription = $3 WHERE exerciseId = $1 RETURNING *`,
        [exerciseID, exerciseName, exerciseDescription]
      );
      if (updatedExercise.rows[0]) {
        updatedExercises.push(updatedExercise.rows[0]);
      }
    }
    //Handling record not found this way since it doesnt catch error if the record is not found
    updatedExercises.length > 0
      ? res.json(updatedExercises)
      : res.status(404).send("exercise id not found");
  } catch (err) {
    console.log(err);
    res.status(500).send(err.detail);
  }
});

// Get all exercises
router.get("/", async function (req, res) {
  try {
    const { rows } = await pool.query(
      "SELECT * from exercise ORDER BY exercisename ASC"
    );
    res.json(rows);
  } catch (err) {
    console.log(err);
  }
});

// Get a exercises based on exercise id
router.get("/details", async function (req, res) {
  try {
    const exerciseIDs = req.query.id;
    const retreivedExercises = [];

    for (let id of exerciseIDs) {
      const { exerciseID } = id;
      const retrievedExercise = await pool.query(
        `SELECT * FROM exercise WHERE exerciseid = $1`,
        [exerciseID]
      );
      if (retrievedExercise.rows[0]) {
        retreivedExercises.push(retrievedExercise.rows[0]);
      }
    }
    retreivedExercises.length > 0
      ? res.status(200).json(retreivedExercises)
      : res.status(404).send("exercise id not found");
  } catch (err) {
    console.log(err);
    res.status(500).send(err.detail);
  }
});

// Get all exercises for a training level
router.get("/level", async function (req, res) {
  try {
    const { levelID } = req.query.id;

    const { rows } = await pool.query(
      "SELECT exercise.* from exercise JOIN levelexercise ON exercise.exerciseid = levelexercise.exerciseid WHERE levelid = $1",
      [levelID]
    );

    rows.length > 0
      ? res.status(200).json(rows)
      : res.status(404).send("level id not found");
  } catch (err) {
    console.log(err);
    res.status(500).send(err.detail);
  }
});

//Link exercises to training level
router.post("/link", async function (req, res) {
  try {
    const IDs = req.body;
    const linkedLevelExercises = [];
    for (let id of IDs) {
      const { levelID, exerciseID } = id;
      const linkedLevelExercise = await pool.query(
        `INSERT INTO "levelexercise" ("levelid", "exerciseid") VALUES ($1, $2) RETURNING *`,
        [levelID, exerciseID]
      );
      linkedLevelExercises.push(linkedLevelExercise.rows[0]);
    }
    res.json(linkedLevelExercises);
  } catch (err) {
    console.log(err);
    res.status(404).send(err.detail);
  }
});

//Unlink exercises from training level
router.delete("/unlink", async function (req, res) {
  try {
    const IDs = req.body;
    const unlinkedLevelExercises = [];
    for (let id of IDs) {
      const { levelID, exerciseID } = id;
      const unlinkedLevelExercise = await pool.query(
        `DELETE FROM "levelexercise" WHERE levelid = $1 AND exerciseid = $2 RETURNING *`,
        [levelID, exerciseID]
      );
      if (unlinkedLevelExercise.rows[0])
        unlinkedLevelExercises.push(unlinkedLevelExercise);
    }
    unlinkedLevelExercises.length > 0
      ? res.status(200).send("DELETED")
      : res.status(404).send("level or exercise id not found");
  } catch (err) {
    console.log(err);
    res.status(500).send(err.detail);
  }
});

//Get all linked levels and exercises
router.get("/link", async function (req, res) {
  try {
    const { rows } = await pool.query(
      `SELECT ex.exerciseid,ex.exercisename, tl.levelid, tl.levelname from exercise ex
      JOIN levelexercise le ON ex.exerciseid = le.exerciseid
      JOIN traininglevel tl ON tl.levelid = le.levelid
      `
    );
    res.json(rows);
  } catch (err) {
    console.log(err);
  }
});

//Get linked levels given exercise id
router.get("/link/:id", async function (req, res) {
  try {
    const exerciseID = req.params.id;

    const { rows } = await pool.query(
      `SELECT le.levelid, tl.levelname 
      FROM levelexercise le 
      JOIN traininglevel tl ON tl.levelid = le.levelid 
      WHERE le.exerciseid = $1
      `,
      [exerciseID]
    );
    res.json(rows);
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
