const express = require("express");
const pool = require("../../db");
const router = express.Router();

//Add new training level
router.post("/", async function (req, res) {
  try {
    const levels = req.body;
    const newLevels = [];
    for (let level of levels) {
      const { levelName, levelDescription } = level;
      const newLevel = await pool.query(
        `INSERT INTO trainingLevel(levelName, levelDescription) VALUES ($1, $2) RETURNING *`,
        [levelName, levelDescription]
      );
      newLevels.push(newLevel.rows[0]);
    }
    res.json(newLevels);
  } catch (err) {
    console.log(err);
    res.status(409).send(err.detail);
  }
});

//Delete a training level
router.delete("/", async function (req, res) {
  try {
    const levelIDs = req.body;
    const deletedLevels = [];
    for (let id of levelIDs) {
      const { levelID } = id;
      const deletedLevel = await pool.query(
        `DELETE FROM trainingLevel WHERE levelid = $1 RETURNING *`,
        [levelID]
      );
      if (deletedLevel.rows[0]) deletedLevels.push(deletedLevel);
    }
    //Handling record not found this way since it doesnt catch error if the record is not found
    deletedLevels.length > 0
      ? res.status(200).send("DELETED")
      : res.status(404).send("level id not found");
  } catch (err) {
    console.log(err);
    res.status(500).send(err.detail);
  }
});

//Update training level
router.put("/", async function (req, res) {
  try {
    const levels = req.body;
    const updatedLevels = [];

    for (let level of levels) {
      const { levelID, levelName, levelDescription } = level;
      const updatedLevel = await pool.query(
        `Update trainingLevel SET levelName = $1, levelDescription = $2 WHERE levelId = $3 RETURNING *`,
        [levelName, levelDescription, levelID]
      );
      if (updatedLevel.rows[0]) {
        updatedLevels.push(updatedLevel.rows[0]);
      }
    }
    //Handling record not found this way since it doesnt catch error if the record is not found
    updatedLevels.length > 0
      ? res.json(updatedLevels)
      : res.status(404).send("level id not found");
  } catch (err) {
    console.log(err);
    res.status(500).send(err.detail);
  }
});

// Get all training levels
router.get("/", async function (req, res) {
  try {
    const { rows } = await pool.query(
      "SELECT * from trainingLevel ORDER BY levelname ASC"
    );
    res.json(rows);
  } catch (err) {
    console.log(err);
  }
});

// Get levels based on level id
router.get("/details", async function (req, res) {
  try {
    const levelIDs = req.query.id;
    const retreivedLevels = [];

    for (let id of levelIDs) {
      const { levelID } = id;
      const retreivedLevel = await pool.query(
        `SELECT * FROM trainingLevel WHERE levelid = $1`,
        [levelID]
      );
      if (retreivedLevel.rows[0]) {
        retreivedLevels.push(retreivedLevel.rows[0]);
      }
    }
    retreivedLevels.length > 0
      ? res.status(200).json(retreivedLevels)
      : res.status(404).send("level id not found");
  } catch (err) {
    console.log(err);
    res.status(500).send(err.detail);
  }
});

//Get linked exercises given levelid
router.get("/link/:id", async function (req, res) {
  try {
    const levelID = req.params.id;

    const { rows } = await pool.query(
      `SELECT le.exerciseid, ex.exercisename 
      FROM levelexercise le 
      JOIN exercise ex ON ex.exerciseid = le.exerciseid
      WHERE le.levelid = $1
      `,
      [levelID]
    );
    res.json(rows);
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
