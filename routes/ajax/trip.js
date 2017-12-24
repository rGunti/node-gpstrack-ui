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
const gpsDistance = require('gps-distance');
const async = require('async');
const moment = require('moment');

const Trip = require('../../db/models/Trip');
const VTripPoint = require('../../db/models/VTripPoint');

const router = require('express').Router();

/** DataTables endpoint for list of trips */
router.get('/', (req, res, next) => {
    datatable(Trip, req.query, {})
        .then((result) => {
            res.json(result);
        });
});

/** Get single trip by ID */
router.get('/:tripID', (req, res, next) => {
    let tripID = req.params.tripID;
    Trip.findById(tripID)
        .then((trip) => {
            if (trip) ApiHelpers.sendData(res, trip.toJSON());
            else ApiHelpers.sendNotFoundResponse(res, tripID);
        })
        .catch((err) => {
            ApiHelpers.sendErrorResponse(res, err, tripID);
        });
});

/** DataTables endpoint for a list of trip points */
router.get('/:tripID/points', (req, res, next) => {
    let tripID = req.params.tripID;
    datatable(VTripPoint, req.query, { where: { tripID: tripID } })
        .then((result) => {
            res.json(result);
        });
});

/** DataTables endpoint for a list of trip points */
router.get('/:tripID/points/graph', (req, res, next) => {
    let tripID = req.params.tripID;
    VTripPoint.findAll({
        where: { tripID: tripID }
    }).then((points) => {
        let graphOutput = {
            chart: {
                caption: "Speed over Time",
                xAxisName: "Time",
                pYAxisName: "Speed",
                sYAxisName: "Fuel Consumption",
                compactDataMode: true,
                dataSeparator: "|",
                numberSuffix: " km/h",
                snumberSuffix: " l/h",
                showvalues: false,
                animation: true
            },
            categories: [{
                category: ""
            }],
            dataset: []
        };
        let categoryArray = [];
        let speedDataSet = [];
        let fuelDataSet = [];
        async.eachSeries(points,
            (i, callback) => {
                categoryArray.push(i.createdAt);
                speedDataSet.push(i.gpsSpeed * 3.6 || i.vehicleSpeed || 0);
                fuelDataSet.push(i.fuelConsumption);
                async.setImmediate(callback);
            },
            (err) => {
                graphOutput.categories[0].category = categoryArray.join('|');
                graphOutput.dataset.push({
                    seriesName: 'Speed',
                    data: speedDataSet.join('|')
                });
                graphOutput.dataset.push({
                    seriesName: 'Fuel Consumption',
                    data: fuelDataSet.join('|'),
                    parentYAxis: "S"
                });
                res.json(graphOutput);
            });
    }).catch((err) => {
        ApiHelpers.sendErrorResponse(res, err, tripID);
    });
});

/** Returns the distance of a trip by calculating the distance between all points [in km] */
router.get('/:tripID/distance', (req, res, next) => {
    let tripID = req.params.tripID;
    VTripPoint.findAll({
        where: { tripID: tripID }
    }).then((points) => {
        //if (!trip) return ApiHelpers.sendNotFoundResponse(res, tripID);
        let latLonArray = [];
        async.eachSeries(points,
            (i, callback) => {
                latLonArray.push([i.latitude, i.longitude]);
                // To ensure that the callstack doesn't overflow
                async.setImmediate(callback);
            },
            (err) => {
                ApiHelpers.sendData(res, gpsDistance(latLonArray));
            }
        );
    }).catch((err) => {
        ApiHelpers.sendErrorResponse(res, err, tripID);
    });
});

module.exports = router;

