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
const Trip = require('../db/models/Trip');

const router = require('express').Router();

router.get('/', (req, res, next) => {
    logger.debug(`Requested from ${req.ip}`);
    HandleRender.render(res, 'trip', 'Trips');
});

router.get('/:tripID/points', (req, res, next) => {
    let tripID = req.params.tripID;
    Trip.findById(tripID)
        .then((trip) => {
            if (trip) {
                let tripName = trip.tripName || `Trip ${trip.tripID}`;
                HandleRender.render(res, 'trippoints', tripName, {
                    trip: trip,
                    tripName: tripName
                });
            } else {
                res.status(404);
                HandleRender.render(res, 'err/404', 'Trip not found');
            }
        });
});

module.exports = router;

