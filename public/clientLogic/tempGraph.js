/**
 * Created by jorgep on 4/17/14.
 */
$(function() {

    // We use an inline data source in the example, usually data would
    // be fetched from a server

    var data = [];

    function getRandomData() {


        if (data.length > 0)
            data = data.slice(1);

        function parseData(json){
            for (var i = 0; i < json.data.length; i++) {
                var year = parseInt(json.data[i].sdatarecordeddate.substring(0,4));
                var month = parseInt(json.data[i].sdatarecordeddate.substring(5,7));
                var day = parseInt(json.data[i].sdatarecordeddate.substring(8,10));
                var hour = parseInt(json.data[i].sdatarecordeddate.substring(11,13));
                var min = parseInt(json.data[i].sdatarecordeddate.substring(14,16));
                var second = parseInt(json.data[i].sdatarecordeddate.substring(17,19));

                data.push([Date.UTC(year, month, day, hour, min, second), json.data[i].sdatavalue]);
            }

        }

        var sensor = document.URL.split('/')[5];
        $.ajax({
            url: '/api/get/temperature/data/' + sensor,
            method: "GET",
            success: parseData
        });

        var res = [];
        for (var i = 0; i < data.length; ++i) {
            res.push(data[i])
        }

        return res;
    }

    // Set up the control widget

    var updateInterval = 30;

    var plot = $.plot("#placeholder", [ getRandomData() ], {
        color: 1,
        series: {
            shadowSize: 0	// Drawing is faster without shadows
        },
        yaxis: {
            min: 0,
            max: 100
        },
        xaxis: {
            mode: "time",
            timezone: "browser"
        }
    });

    function update() {

        plot.setData([getRandomData()]);

        plot.setupGrid()

        plot.draw();
        setTimeout(update, updateInterval);
    }

    update();

    // Add the Flot version string to the footer

    $("#footer").prepend("Flot " + $.plot.version + " &ndash; ");
});