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

const util = require('util');
const path = require('path');
const debug = require('debug');
const moment = require('moment');
const logConfig = require('config').get('logging');

function mergeObject(master, slave) {
    Object.assign(master, slave);
}

function initLogDestinations(logBase, sourceName, logToStdout) {
    let d = {
        debug: debug(`${logBase}:DEBUG:${sourceName}`),
        info: debug(`${logBase}:INFO:${sourceName}`),
        warn: debug(`${logBase}:WARN:${sourceName}`),
        error: debug(`${logBase}:ERROR:${sourceName}`),
        fatal: debug(`${logBase}:FATAL:${sourceName}`)
    };
    if (logToStdout) {
        let levels = logToStdout.split(',');
        for (let level of levels) {
            if (level in d) {
                let i = d[level];
                i.log = console.log.bind(console);
            }
        }
    }
    return d;
}

module.exports = (source) => {
    let logInstance = {
        _levelDestinations: {
            debug: null,
            info: null,
            warn: null,
            error: null,
            fatal: null
        },
        config: {
            logBase: '<DebugLogger>',
            logToStdout: true,
            showTimestamp: true,
            timestampFormat: 'Y-MM-DD HH:mm:ss.SSS'
        },
        log: (level, text) => {
            let logString = '';
            if (logInstance.config.showTimestamp) {
                logString += `${moment().format(logInstance.config.timestampFormat)} | `;
            }
            let messageType = typeof text;
            if (messageType === 'string' || messageType === 'number') {
                logString += text;
            } else {
                logString += util.inspect(text);
            }
            logInstance._levelDestinations[level.toLowerCase()](logString)
        },
        debug: (text) => logInstance.log('debug', text),
        info: (text) => logInstance.log('info', text),
        warn: (text) => logInstance.log('warn', text),
        error: (text) => logInstance.log('error', text),
        fatal: (text) => logInstance.log('fatal', text)
    };
    mergeObject(logInstance.config, logConfig);
    logInstance._levelDestinations = initLogDestinations(
        logInstance.config.logBase,
        path.basename(source || __filename),
        logInstance.config.logToStdout
    );
    return logInstance;
};
