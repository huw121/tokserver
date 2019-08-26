const express = require('express');
const OpenTok = require('opentok');
const app = express();
const cors = require('cors');
app.use(cors());
const apiKey = process.env.API_KEY || require('./config.js').key
const apiSecret = process.env.API_SECRET || require('./config.js').secret

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

app.get('/session', function (req, res) {
  promisifiedOpenTok()
    .then(sessionId => {
      res.status(200).send({ sessionId })
    })
    .catch(err => { throw err })
});

app.get('/token/:sessionId', function (req, res) {
  const { sessionId } = req.params;
  const token = opentok.generateToken(sessionId);
  res.status(200).send({ token })
});
