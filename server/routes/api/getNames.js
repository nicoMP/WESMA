const express = require("express");
const pool = require("../../db");
const router = express.Router();

router.get("/instructor_name", async function (req, res) {
    try {
        const {rows} = await pool.query(`SELECT instructorid, instructorname FROM Instructor`);
        res.json(rows)
    } catch (err) {
      console.log(err);
    }
  });
  router.get("/level_name", async function (req, res) {
    try {
        const {rows} = await pool.query(`SELECT levelid, levelname  FROM TrainingLevel`);
        res.json(rows)
    } catch (err) {
      console.log(err);
    }
  });
  module.exports = router