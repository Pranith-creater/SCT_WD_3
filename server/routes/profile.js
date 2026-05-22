const express = require('express');

const router = express.Router();

router.get('/', (_req, res) => {
  res.json({
    name: process.env.PROFILE_NAME || 'Pranith Modalla',
    github: process.env.GITHUB_URL || 'https://github.com/Pranith-creater',
    linkedin: process.env.LINKEDIN_URL || 'https://www.linkedin.com/in/pranith-modalla-771951325',
  });
});

module.exports = router;
