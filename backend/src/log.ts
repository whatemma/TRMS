import log4js from 'log4js';

log4js.configure('logconfig.json');
const logger = log4js.getLogger();

export default logger;
