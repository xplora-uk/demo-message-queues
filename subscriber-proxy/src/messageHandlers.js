const axios = require('axios');

class MessageHandler {

  constructor(queue, httpClient, channel = null) {
    this.queue = queue;
    this.httpClient = httpClient;
    this.channel = channel;
  }

  setChannel(channel) {
    this.channel = channel;
  }

  async onMessage(msg) {
    console.info(this.queue + ' handler', msg);
    let result = false;
    try {
      // buffer -> string/JSON -> parse -> object
      const data = msg.content.toString('utf8');
      console.info(this.queue + ' handler data', data);
      const res = await this.httpClient.post('/' + this.queue, JSON.parse(data));
      result = res.status === 200; // expected
      console.info(this.queue + ' handler result', result.data);

      // acknowledge message: inform queue system -> msg DONE -> remove from queue
      this.channel.ack(msg);
    } catch (err) {
      console.error(this.queue + ' handler error', err);

      // not acknowledge message: msg is kept in the queue
      this.channel.nack(msg);
    }

    return result; 
  }
}

async function makeMessageHandlers(config) {

  // Array<MessageHandler>
  const handlers = [];

  const qCount = Number.parseInt(config.QUEUE_COUNT || '0');

  for (let i = 1; i <= qCount; i++) {
    const queue = config[`QUEUE_${i}_NAME`];
    const targetUrl = config[`QUEUE_${i}_TARGET_URL`];

    // TODO: settings not looking correct: throw error?
    if (!queue || !targetUrl) continue; // skip for now

    const httpClient = axios.create({ baseURL: targetUrl });
    const msgHandler = new MessageHandler(queue, httpClient);
    handlers.push(msgHandler);
  }

  return handlers;
}

module.exports = { MessageHandler, makeMessageHandlers };
