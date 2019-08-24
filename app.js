const express = require('express');
const OpenTok = require('opentok');
const app = express();
const cors = require('cors');
const {key, secret} = require('./config.js');
app.use(cors());
const apiKey = process.env.API_KEY || key;
const apiSecret = process.env.API_SECRET || secret;

// Verify that the API Key and API Secret are defined
if (!apiKey || !apiSecret) {
  console.log('You must specify API_KEY and API_SECRET environment variables');
  process.exit(1);
}

const PORT = process.env.PORT || 3000;

// Starts the express app
app.listen(PORT, function () {
  console.log('listening on:', PORT);
});

// Initialise OpenTok
const opentok = new OpenTok(apiKey, apiSecret);

const promisifiedOpenTok = () => {
  return new Promise((resolve, reject) => {
    opentok.createSession(function (err, session) {
      if (err) reject(err)
      else resolve(session.sessionId)
    });
  })
}

app.get('/', function (req, res) {
  promisifiedOpenTok()
    .then(sessionId => {
      const token = opentok.generateToken(sessionId);
      res.status(200).send({ sessionId, token })
    })
    .catch(err => {throw err})
});
