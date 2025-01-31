const express = require('express');
const Team = require('../models/Team');

const router = express.Router();

// Create a new team
router.post('/create', async (req, res) => {
  const {name, email} = req.body;
  console.log(req.body)
  try {
    const teamExist = await Team.findOne({name, email});
    if (teamExist) {
      return res.status(409).json({message: 'Team name already exists'});
    }

    const newTeam = new Team({name, email});
    await newTeam.save();
    res.status(201).json({ message: 'Team created successfully!', team: newTeam });
    // console.log({ message: 'Team created successfully!', team: newTeam });
  } catch (error) {
      res.json({ message: 'Failed to create team', error });
    }
});


// Fetch all teams
router.get('/teams', async (req, res) => {
    const {email} = req.query;
    try {
        const teams = await Team.find({email});
        res.status(200).json(teams);
        // console.log(teams);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch teams', error });
    }
});


// delete a particular team
router.delete('/teams/:id', async (req, res) => {
    // console.log(req.params)
    const teamId = req.params.id;  
    if (!teamId) {
        return res.status(400).json({ message: 'Team ID is required' });
    }
    console.log(teamId);
    try{
      const deletedTeam = await Team.findByIdAndDelete(teamId);
      res.status(200).json({ message: 'Team deleted successfully', team: deletedTeam });
    } catch (error){
      console.error('Error deleting team:', error);
      res.status(500).json({ message: 'Failed to delete team', error });
    }
});


module.exports = router;
