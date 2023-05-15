const express = require("express");
const pool = require("../../db");
const router = express.Router();

//Add new skills
router.post("/", async function (req, res) {
  try {
    const skills = req.body;
    const newSkills = [];
    for (let skill of skills) {
      const { skillName, skillDescription } = skill;
      const newSkill = await pool.query(
        `INSERT INTO "skill" ("skillname", "skilldescription") VALUES ($1, $2) RETURNING *`,
        [skillName, skillDescription]
      );
      newSkills.push(newSkill.rows[0]);
    }
    res.json(newSkills);
  } catch (err) {
    console.log(err);
    res.status(409).send(err.detail);
  }
});

//Get all skills
router.get("/", async function (req, res) {
  try {
    const { rows } = await pool.query(
      "SELECT * from skill ORDER BY skillname ASC"
    );
    res.json(rows);
  } catch (err) {
    console.log(err);
  }
});

//Get all skills for a specific exercise id
router.get("/exercise", async function (req, res) {
  try {
    const { exerciseID } = req.query.id;
    const { rows } = await pool.query(
      "SELECT skill.* from skill JOIN exerciseskill ON skill.skillid = exerciseskill.skillid WHERE exerciseid = $1",
      [exerciseID]
    );

    res.json(rows);
  } catch (err) {
    console.log(err);
  }
});

// Get skills based on skill id
router.get("/details", async function (req, res) {
  try {
    const skillIDs = req.query.id;
    const retreivedSkills = [];

    for (let id of skillIDs) {
      const { skillID } = id;
      const retreivedSkill = await pool.query(
        `SELECT * FROM skill WHERE skillid = $1`,
        [skillID]
      );
      if (retreivedSkill.rows[0]) {
        retreivedSkills.push(retreivedSkill.rows[0]);
      }
    }
    retreivedSkills.length > 0
      ? res.status(200).json(retreivedSkills)
      : res.status(404).send("skill id not found");
  } catch (err) {
    console.log(err);
    res.status(500).send(err.detail);
  }
});

//Update skills
router.put("/", async function (req, res) {
  try {
    const skills = req.body;
    const updatedSkills = [];

    for (let skill of skills) {
      const { skillID, skillName, skillDescription } = skill;
      const updatedSkill = await pool.query(
        `Update "skill" SET skillname = $1, skilldescription = $2 WHERE skillid = $3 RETURNING *`,
        [skillName, skillDescription, skillID]
      );
      if (updatedSkill.rows[0]) {
        updatedSkills.push(updatedSkill.rows[0]);
      }
    }
    //Handling record not found this way since it doesnt catch error if the record is not found
    console.log(updatedSkills.length);
    updatedSkills.length > 0
      ? res.json(updatedSkills)
      : res.status(404).send("skill id not found");
  } catch (err) {
    console.log(err);
    res.status(500).send(err.detail);
  }
});

//Delete skills
router.delete("/", async function (req, res) {
  try {
    const skillIDs = req.body;
    const deletedSkills = [];
    for (let id of skillIDs) {
      const { skillID } = id;
      const deletedSkill = await pool.query(
        `DELETE FROM "skill" WHERE skillid = $1 RETURNING *`,
        [skillID]
      );
      if (deletedSkill.rows[0]) deletedSkills.push(deletedSkill);
    }
    //Handling record not found this way since it doesnt catch error if the record is not found
    deletedSkills.length > 0
      ? res.status(200).send("DELETED")
      : res.status(404).send("skill id not found");
  } catch (err) {
    console.log(err);
    res.status(500).send(err.detail);
  }
});

//Get all link exercises and skills
router.get("/link", async function (req, res) {
  try {
    const { rows } = await pool.query(
      `SELECT ex.exerciseid,ex.exercisename, sk.skillid, sk.skillname from exercise ex
    JOIN exerciseskill es ON ex.exerciseid = es.exerciseid
    JOIN skill sk ON sk.skillid = es.skillid
    `
    );
    res.json(rows);
  } catch (err) {
    console.log(err);
  }
});

//Link skills to exercise
router.post("/link", async function (req, res) {
  try {
    const IDs = req.body;
    const linkedExerciseSkills = [];
    for (let id of IDs) {
      const { skillID, exerciseID } = id;
      const linkedExerciseSkill = await pool.query(
        `INSERT INTO "exerciseskill" ("skillid", "exerciseid") VALUES ($1, $2) RETURNING *`,
        [skillID, exerciseID]
      );
      linkedExerciseSkills.push(linkedExerciseSkill.rows[0]);
    }
    res.json(linkedExerciseSkills);
  } catch (err) {
    console.log(err);
    res.status(404).send(err.detail);
  }
});

//Unlink skills to exercise
router.delete("/unlink", async function (req, res) {
  try {
    const IDs = req.body;
    const unlinkedExerciseSkills = [];
    for (let id of IDs) {
      const { skillID, exerciseID } = id;
      const unlinkedExerciseSkill = await pool.query(
        `DELETE FROM "exerciseskill" WHERE skillid = $1 AND exerciseid = $2 RETURNING *`,
        [skillID, exerciseID]
      );
      if (unlinkedExerciseSkill.rows[0])
        unlinkedExerciseSkills.push(unlinkedExerciseSkill);
    }
    unlinkedExerciseSkills.length > 0
      ? res.status(200).send("DELETED")
      : res.status(404).send("skill or exercise id not found");
  } catch (err) {
    console.log(err);
    res.status(500).send(err.detail);
  }
});

//Get linked exercises given skill id
router.get("/link/:id", async function (req, res) {
  try {
    const skillID = req.params.id;

    const { rows } = await pool.query(
      `SELECT es.exerciseid, ex.exercisename 
      FROM exerciseskill es
      JOIN exercise ex ON ex.exerciseid = es.exerciseid 
      WHERE es.skillid = $1
      `,
      [skillID]
    );
    res.json(rows);
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
