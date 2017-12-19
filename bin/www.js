/*
 * Copyright 2017 Raphael Guntersweiler
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */
const logger = require('../utils/debuglogger')(__filename);
const config = require('config');
const http = require('http');

logger.info(`Starting up ${config.get('app.fullName')} [${config.get('app.instance')}]`);

logger.debug('Creating an app instance');
const app = require('../app');
const serverPort = config.get('server.port');
app.set('port', serverPort);

logger.debug('Creating server ...');
let server = http.createServer(app);
server.listen(serverPort);
server.on('error', (err) => {
    if (err.syscall !== 'listen') throw err;

    switch (err.code) {
        case 'EACCES':
            logger.fatal(`Binding requires elevated privileges! The app will now terminate.`);
            process.exit(1000);
            break;
        case 'EADDRINUSE':
            logger.fatal(`Port ${serverPort} is already in use.`);
            process.exit(1001);
            break;
        default:
            throw err;
    }
});
server.on('listening', () => {
    let addr  = server.address();
    let bind = typeof addr === 'string' ?
        'Pipe ' + addr :
        'Port ' + addr.port;
    logger.info(`Listening on ${bind}`);
});
