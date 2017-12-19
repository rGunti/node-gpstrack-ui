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
const HandleRender = require('../utils/handlebar-renderer');

const router = require('express').Router();

router.get('/', (req, res, next) => {
    logger.debug(`Requested from ${req.ip}`);
    HandleRender.render(res, 'index', 'Home');
});

if (config.has('server.enableDebugRoutes') && config.get('server.enableDebugRoutes')) {
    logger.warn('Debug Routes have been enabled!');
    router.get('/exception', (req, res, next) => {
        throw new Error('This is a test exception');
    });
}

module.exports = router;
