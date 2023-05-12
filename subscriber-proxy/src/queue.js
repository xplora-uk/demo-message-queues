const amqp = require('amqp-connection-manager');

async function makeQueueConnection(config) {

  const connection = amqp.connect([config.queueUrl]); // e.g. 'amqp://localhost'

  connection.on('connect', () => console.log('queue Connected!'));
  connection.on('disconnect', err => console.log('queue Disconnected.', err.stack));

  async function setupChannel(queueName, messageHandler) {
    const channelWrapper = connection.createChannel({
      json: true,
      setup: async (channel) => {
        // inject dependency to use to ACK and NACK messages
        messageHandler.setChannel(channel);

        // make sure the queue exists
        await channel.assertQueue(queueName, { durable: true });

        // attach the listener/handler
        await channel.consume(queueName, (msg) => messageHandler.onMessage(msg));
      },
    });

    return channelWrapper;
  }

  return {
    connection,
    setupChannel,
  };

}

module.exports = { makeQueueConnection };
