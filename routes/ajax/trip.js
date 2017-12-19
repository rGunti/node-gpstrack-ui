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

const logger = require('../../utils/debuglogger')(__filename);
const config = require('config');
const ApiHelpers = require('../../utils/api-helpers');
const datatable = require(`sequelize-datatables`);

const Trip = require('../../db/models/Trip');
const VTripPoint = require('../../db/models/VTripPoint');

const router = require('express').Router();

router.get('/', (req, res, next) => {
    datatable(Trip, req.query, {})
        .then((result) => {
            res.json(result);
        });
});

router.get('/:tripID', (req, res, next) => {
    let tripID = req.params.tripID;
    Trip.findById(tripID)
        .then((trip) => {
            if (trip) ApiHelpers.sendData(res, trip.toJSON());
            else ApiHelpers.sendNotFoundRespnse(res, tripID);
        })
        .catch((err) => {
            ApiHelpers.sendErrorResponse(res, err, tripID);
        });
});

router.get('/:tripID/points', (req, res, next) => {
    let tripID = req.params.tripID;
    datatable(VTripPoint, req.query, { where: { tripID: tripID } })
        .then((result) => {
            res.json(result);
        });
});

module.exports = router;

