const amqp = require('amqp-connection-manager');

async function makeQueueConnection(config) {

  const connection = amqp.connect([config.queueUrl]); // e.g. 'amqp://localhost'

  connection.on('connect', () => console.log('queue Connected!'));
  connection.on('disconnect', err => console.log('queue Disconnected.', err.stack));

  async function setupChannel(queueName) {
    const channelWrapper = connection.createChannel({
      json: true,
      setup: function (channel) {
        return channel.assertQueue(queueName, { durable: true });
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
