const express = require("express");
const pool = require("../../db");
const router = express.Router();
const config = require('config');
const jwt = require("jsonwebtoken");
const auth = require('../../middleware/auth');

//Get User
router.get('/', auth, async (req, res) => {
  try {
    res.json({
      id: req.user.id,
      isInstructor: req.user.isinstructor
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err.detail);
  }
});
//Login Route
router.post('/', async (req, res) => {
  const { username, password } = req.body;

  try{
    const { rows } = await pool.query('SELECT * from mocklogin WHERE username = $1', [username]);

    if(rows.length == 0) {
      res.status(400).json({ msg: 'Invalid Credentials 1' });
    }

    const user = rows[0];

    let payload = {
      user: {
        id: '',
        isinstructor: false
      }
    }

    //Would first need to decrypt hashed password in production
    //This is just here for demo
    if(password !== user.hashedpasswd){
      res.status(400).json({ msg: 'Invalid Credentials 2' });
    }

    if(user.isinstructor) {
      data = await pool.query(`SELECT * from Instructor WHERE instructorUserId = $1`, [username]);
      const instructor = data.rows[0];
      payload = {
        user: {
          id: instructor.instructorid,
          isinstructor: true
        }
      }
      console.log(instructor);
    }    
    else {
      data = await pool.query(`SELECT * from Student WHERE studentUserId = $1`, [username]);
      const student = data.rows[0];
      payload = {
        user: {
          id: student.studentid,
          isinstructor: false
        }
      }
    } 

    //signs a jwt for use on the frontend
    //webtoken will protect views based on the user
    jwt.sign(
      payload,
      config.get('jwtSecret'),
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
    
  } catch(err) {
    console.error(err);
    res.status(500).json(err.detail);
  }
});

module.exports = router;