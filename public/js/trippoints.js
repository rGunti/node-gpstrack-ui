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

function renderCoordinateLink(text, type, point) {
    var l = $('<a>');
    l.attr('href', 'http://www.google.com/maps/place/' + point.latitude + ',' + point.longitude);
    l.attr('target', '_blank');
    l.text(text);
    return $('<div>').append(l).html();
}

var tripID = null;

$(document).ready(function() {
    var tripID = $('.points-table').data('trip-id');
    $('.points-table').DataTable({
        processing: true,
        serverSide: true,
        responsive: true,
        filter: false,
        dom: '<i<t>p>',
        ajax: '/ajax/trip/' + tripID + '/points',
        columns: [
            { data: 'latitude', class: 'text-right', render: renderCoordinateLink },
            { data: 'longitude', class: 'text-right', render: renderCoordinateLink },
            { data: 'altitude', class: 'text-right', render: function(d, t, r) {
                return d + ' m'
                } },
            { data: 'gpsSpeed', class: 'text-right', render: function(d, t, r) {
                return (d) ? Math.round(d * 3.6) + ' km/h' : '-'
                } },
            { data: 'vehicleSpeed', class: 'text-right', render: function(d, t, r) {
                    return (d) ? d + ' km/h' : '-'
                } },
            { data: 'fuelConsumption', class: 'text-right', render: function (d, t, r) {
                return (d) ? (Math.round(d * 100) / 100) + ' l/h' : '-'
                }
                /*, render: function(d, t, r) {
                    let lph = (d) ? Math.round(d * 100) / 100 : null;
                    let lpk = (lph) ? ((r.gpsSpeed && r.gpsSpeed > 0) ? Math.round((lph / 100 * r.gpsSpeed) * 100) / 100 : null) : null;

                    if (lph && lpk) {
                        return $('<div>').append($('<abbr>').attr('title', lpk + ' l/100km').text(lph + ' l/h')).html();
                    } else if (lph) {
                        return lph + ' l/h';
                    } else {
                        return '-';
                    }
                }*/ },
            { data: 'createdAt', render: function(d, t, r) {
                return moment(d, moment.ISO_8601).format('ll LTS')
            } }
        ],
        order: [
            [ 6, 'asc' ]
        ]
    });

    $.ajax('/ajax/trip/' + tripID + '/distance')
        .done(function(d) {
            $('.trip-distance')
                .removeClass('fa fa-spin fa-refresh')
                .text((Math.round(d.data * 1000) / 1000) + ' km')
        })
        .fail(function() {
            var err = $('<span>').addClass('fa fa-fw fa-exclamation-triangle');
            var errText = $('<span>').text('Failed to calculate distance');
            $('.trip-distance')
                .removeClass('fa fa-spin fa-refresh')
                .addClass('text-danger')
                .append(err)
                .append(errText);
        });
});
