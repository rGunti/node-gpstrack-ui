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
const logger = require('./utils/debuglogger')(__filename);
const path = require('path');
const config = require('config');
const express = require('express');
const hbs = require('express-hbs');
const bodyParser = require('body-parser');

logger.debug('Instantiating app...');
let app = express();

logger.debug('Configuring views...');
app.set('views', path.join(__dirname, config.get('internals.dirs.views')));

logger.debug('Configuring Handlebars and Handlebars Helpers...');
let hbsEngine = hbs.express4({
    defaultLayout: path.join(__dirname, config.get('internals.dirs.hbs.defaultLayout')),
    partialsDir: path.join(__dirname, config.get('internals.dirs.hbs.partials')),
    layoutsDir: path.join(__dirname, config.get('internals.dirs.hbs.layouts'))
});
require('handlebars-helpers')({ handlebars: hbs.handlebars });
require('./utils/handlebar-helpers').registerHelperMethods(hbs.handlebars);

app.engine('hbs', hbsEngine);
app.set('view engine', 'hbs');

logger.debug('Configuring middleware...');
app.use(require('morgan')('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('cookie-parser')());
app.enable('trust proxy');

logger.debug('Configuring static routes...');
const staticRoutes = require(path.join(__dirname, config.get('internals.dirs.staticRoutes')));
for (let source in staticRoutes) {
    let route = staticRoutes[source];
    logger.debug(` - Mounting route for ${source} to ${route}`);
    app.use(route, express.static(path.join(__dirname, source)));
}

logger.debug('Configuring routes...');
const routes = require(path.join(__dirname, config.get('internals.dirs.routes')));
for (let source in routes) {
    let route = routes[source];
    logger.debug(` - Mounting route for ${source} to ${route}`);
    app.use(route, require(path.join(__dirname, source)));
}

logger.debug('Configuring error handling ...');
require('./routes/error-handling')(app);

logger.info('App configuration completed');
module.exports = app;
