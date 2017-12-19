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
const moment = require('moment');
const HandleRender = require('../utils/handlebar-renderer');

module.exports = (app) => {
    // 404 Handler
    app.use((req, res, next) => {
        res.status(404);
        HandleRender.render(res, 'err/404', 'Page Not Found', {
            requestedUrl: req.url
        });
    });

    // Default Error Handler
    app.use((err, req, res, next) => {
        let errorInfo = {
            message: err.message,
            status: null,
            trace: null,
            error: null,
            requestedUrl: `${req.method} ${req.url}`,
            timestamp: moment().toISOString()
        };

        if (config.get('server.showTraces')) {
            errorInfo.status = err.status;
            errorInfo.trace = err.stack;
            errorInfo.error = err;
        }

        res.status(err.status || 500);
        logger.error(err);
        HandleRender.render(res, `err/${err.status || 500}`, 'Error', errorInfo);
    });
};
