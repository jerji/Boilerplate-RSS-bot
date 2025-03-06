const { bootstrap } = require('global-agent');
const { cleanEnv, str, num, makeValidator } = require('envalid');
const Watcher = require('./lib/feedWatcher');
const logger = require('./src/logger')('app');
const { version } = require('./package.json');

// Initialize Proxy Server, if defined.
if (process.env.GLOBAL_AGENT_HTTP_PROXY) {
  logger.debug('invoke global agent proxy');
  bootstrap();
}

// Custom validator for comma-separated strings
const commaSeparatedStrings = makeValidator(x => {
  if (typeof x !== 'string' || x.trim() === '') {
    throw new Error('Expected a non-empty comma-separated string');
  }
  return x.split(',').map(s => s.trim());
});

// Process ENV Parameters
const env = cleanEnv(process.env, {
  RSS_INTERVAL: num({ default: 5 }),
  FEED_ROOM_ID: str(),
  RSS_FEED_URLS: commaSeparatedStrings({ desc: 'Comma-separated list of RSS feed URLs' }),
  TOKEN: str(),
});

const parserService = require('./src/parserService');
const httpService = require('./src/httpService');

// Load RSS Watcher Instances
const interval = env.RSS_INTERVAL;
const feedWatchers = [];

env.RSS_FEED_URLS.forEach(feedUrl => {
  const newFeedWatcher = new Watcher(feedUrl, interval);
  feedWatchers.push(newFeedWatcher);

  // Process New Feed
  newFeedWatcher.on('new entries', (entries) => {
    entries.forEach((item) => {
      logger.debug(`new feed item from ${feedUrl}`);
      parserService.parseFeed(item);
    });
  });

  // Handle New Feed Errors
  newFeedWatcher.on('error', (error) => {
    logger.warn(`New Feed Error (${feedUrl}): ${error}`);
  });
});


// Init Function
async function init() {
  logger.info(`RSS bot Loading, v${version}`);
  try {
    const bot = await parserService.getBot();
    logger.info(`Bot Loaded: ${bot.displayName} (${bot.emails[0]})`);
  } catch (error) {
    logger.error('ERROR: Unable to load Webex Bot, check Token.');
    logger.debug(error.message);
    process.exit(2);
  }
  try {
    const feedRoom = await parserService.getRoom(env.FEED_ROOM_ID);
    logger.info(`Feed Room Name: ${feedRoom.title}`);
  } catch (error) {
    logger.error('ERROR: Bot is not a member of the RSS Feed Room!');
    process.exit(2);
  }

  feedWatchers.forEach(watcher => watcher.start());
  logger.info('Startup Complete!');
  let feed_list = '';
  env.RSS_FEED_URLS.forEach(feedUrl => {feed_list += '<li>' +feedUrl + '</li> \n';});
  await httpService.postMessage(env.TOKEN, env.FEED_ROOM_ID, `BeanRSS Started with ${feedWatchers.length} watchers, monitoring the following links: \n <ul>${feed_list}</ul>`);
}

// Initiate
init();

// Handle Graceful Shutdown (CTRL+C)
process.on('SIGINT', () => {
  logger.debug('Stopping...');
  feedWatchers.forEach(watcher => watcher.stop());
  logger.debug('Feeds Stopped.');
  process.exit(0);
});