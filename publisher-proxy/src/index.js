const express = require('express');
const dotenv = require('dotenv');
const { makeQueueConnection } = require('./queue');
const { makeApi } = require('./api');

dotenv.config();
main();

async function main() {

  const app = express();

  app.use(express.json()); // body parser

  const queueConn = await makeQueueConnection({ queueUrl: process.env.QUEUE_URL })

  const api = await makeApi(queueConn);

  app.post('/publish/:queue', api.handleRequestToPublish);

  app.get('/health', (req, res) => {
    res.json({ status: 'OK', ts: new Date() });
  });

  app.listen(process.env.PORT, () => {
    console.log(`publisher proxy listening on port ${process.env.PORT}`);
  });
}
