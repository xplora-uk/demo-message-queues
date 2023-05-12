async function makeApi(queueConn) {

  async function handleRequestToPublish(req, res) {
    try {
      console.info('/publish/:queue path', req.path);
      console.info('/publish/:queue params', req.params);
      console.info('/publish/:queue query', req.query);

      const { queue } = req.params; // TODO: validate queue name

      const data = req.body; // TODO: validate data

      const channelWrapper = await queueConn.setupChannel(queue);

      console.info('sending to queue', data);
      const result = await channelWrapper.sendToQueue(queue, data);
      console.info('sent to queue', result);

      return res.status(200).json({ status: 'OK', ts: new Date() });
      
    } catch(err) {
      console.error(err);
      return res.status(500).json({ status: 'ERROR', ts: new Date() });
    }
  }

  return {
    handleRequestToPublish,
  };

}

module.exports = { makeApi };
