$(function () {
    $('#data-topology').click(function () {
        $('#topology-show-data-window').window('open');

        // $.ajax({
        //     type: "GET",
        //     url: "../data/poc_data.json",
        //     dataType: "json",
        //     success: function (data) {
        //         var html = '';
        //         // console.log(data.rows);
        //         $.each(data.rows, function (filed, value) {
        //             html += '<tr><td>' + value['Field'] + '</td>' + '<td>' + value['Value'] + '</td></tr>';
        //         });
        //         $('#table-body').append(html);
        //     }
        // });

        Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });

        // $.ajax({
        //     type: "GET",
        //     url: "../data/detail_interval_data.txt",
        //     success: function (data) {
        //         var result = data.split('\n');
        //         // console.log(result)
        //         // console.log(typeof result)
        //         var res = [];
        //         for (let i = 0; i < result.length; i++) {
        //             res.push(parseFloat(result[i]))
        //         }
        //         // console.log(JSON.stringify(res))
        //         let series = new Array();
        //         // let series = [];
        //         for (let i = 0; i < res.length; i++) {
        //             series.push(i);
        //         }
        //         // console.log(series);
        //         series = series.map((key, value) => [key, res[value]])
        //         // console.log(JSON.stringify(series))
        //         var newdata = [];
        //         for (let i = 0; i < 20000; i++) {
        //             // console.log(series[i]);
        //             newdata.push(series[i]);
        //         }
        //         console.log(JSON.stringify(newdata))
        //     }
        // })

        // $.getJSON('../data/test2.json', function (data) {
        //     chart = $('#data-container').highcharts({
        //         chart: {
        //             type: 'line',
        //         },
        //         yAxis: {
        //             title: {
        //                 text: 'ms'
        //             }
        //         },
        //         series: [{data}]
        //     });
        // })

        $.getJSON('../data/detail_interval_data2.json', function (data) {
            // console.log(data);
            chart = $('#data-container').highcharts({
                chart: {
                    zoomType: 'x'
                },
                title: {
                    text: 'Data Statistics'
                },
                xAxis: {
                    type: 'datetime',
                    dateTimeLabelFormats: {
                        millisecond: '%H:%M:%S.%L',
                        second: '%H:%M:%S',
                        minute: '%H:%M',
                        hour: '%H:%M',
                        day: '%m-%d',
                        week: '%m-%d',
                        month: '%Y-%m',
                        year: '%Y'
                    }
                },
                tooltip: {
                    dateTimeLabelFormats: {
                        millisecond: '%H:%M:%S.%L',
                        second: '%H:%M:%S',
                        minute: '%H:%M',
                        hour: '%H:%M',
                        day: '%Y-%m-%d',
                        week: '%m-%d',
                        month: '%Y-%m',
                        year: '%Y'
                    }
                },
                yAxis: {
                    title: {
                        text: 'ms'
                    },
                    min: 0,
                    max: 10
                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    area: {
                        fillColor: {
                            linearGradient: {
                                x1: 0,
                                y1: 0,
                                x2: 0,
                                y2: 1
                            },
                            stops: [
                                [0, Highcharts.getOptions().colors[0]],
                                [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                            ]
                        },
                        marker: {
                            radius: 2
                        },
                        lineWidth: 1,
                        states: {
                            hover: {
                                lineWidth: 1
                            }
                        },
                        threshold: null
                    }
                },
                series: [{
                    type: 'area',
                    // type: 'line',
                    name: 'topology',
                    data: data
                }],
                credits: {
                    enabled: false
                }
            });
        })

    });
})