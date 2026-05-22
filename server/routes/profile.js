const express = require('express');

const router = express.Router();

router.get('/', (_req, res) => {
  res.json({
    name: process.env.PROFILE_NAME || 'Tanmayee',
    github: process.env.GITHUB_URL || '',
    linkedin: process.env.LINKEDIN_URL || '',
  });
});

module.exports = router;
