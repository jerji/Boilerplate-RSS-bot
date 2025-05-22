const { cleanEnv, str } = require('envalid');
const logger = require('./logger')('parserService');
const httpService = require('./httpService');

// Process ENV Parameters
const env = cleanEnv(process.env, {
  TOKEN: str(),
  FEED_ROOM_ID: str(),
  RSS_FEED_URLS: str(),
});

function parserService() {
  function formatDescription(description) {
    // Implement custom formatting to description field
    if(description) {
      let formatted = description;
      formatted = formatted.replace(/\r?\n|\r/g, '<br />');
      formatted = formatted.replace(/<strong>-- /g, '<strong>');
      formatted = formatted.replace(/ --<\/strong>/g, '</strong>');
      return formatted;
    }
    return 'No description.';
  }

  async function getBot() {
    return await httpService.getField(env.TOKEN, 'people/me');
  }

  async function getRoom(roomId) {
    return await httpService.getField(env.TOKEN, `rooms/${roomId}`);
  }

  async function parseFeed(item) {
    const output = {};
    logger.debug('EVENT: NEW FEED');
    output.title = item.title;
    output.description = formatDescription(item.description);
    output.guid = item.guid.replace(/\r\n/g, '');
    output.link = item.link;

    //message that the bot will send to space
    let html = `<h6>From: <a href="${item.meta.link}">${item.meta.title}</a></h6><h3><a href="${output.link}">${output.title}</a></h3><p>${output.description}<p><hr/>`;
    const max_lenght = 7439;
    const message = "...(truncated)</p><hr/>";

    if (html.length > max_lenght) {
      logger.info('Message too long. Trimming.');
      html = html.substring(0, max_lenght - message.length) + message;
    }
    await httpService.postMessage(env.TOKEN, env.FEED_ROOM_ID, html);
    const jsonOutput = JSON.stringify(output);
    logger.debug(`Output: ${jsonOutput}`);
  }

  return {
    getBot,
    getRoom,
    parseFeed,
  };
}

module.exports = parserService();
