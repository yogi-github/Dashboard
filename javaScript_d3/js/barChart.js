function dsBarChartBasics() {

    var margin = {
            top: 60,
            right: 5,
            bottom: 20,
            left: 50
        },
        width = 500 - margin.left - margin.right,
        height = 250 - margin.top - margin.bottom,
        colorBar = d3.scaleOrdinal(d3.schemeCategory10),
        barPadding = 1;

    return {
        margin: margin,
        width: width,
        height: height,
        colorBar: colorBar,
        barPadding: barPadding
    };
}

function dsBarChart(states, city) {

    d3.json("data/data.json", function(error, data) {
        var ds = []
        for (x in data) {
            if (data[x].state == states) {
                for (y in data[x].cities) {
                    if (data[x].cities[y].name == city) {
                        for (z in data[x].cities[y].data) {
                            var obj = {};
                            obj.category = data[x].cities[y].data[z].year;
                            obj.measure = data[x].cities[y].data[z].usage;
                            ds.push(obj);
                        }
                    }
                }
            }
        }

        console.log(ds);
        firstDatasetBarChart = ds;

        var basics = dsBarChartBasics();

        var margin = basics.margin,
            width = basics.width,
            height = basics.height,
            colorBar = basics.colorBar,
            barPadding = basics.barPadding;

        var xScale = d3.scaleLinear()
            .domain([0, firstDatasetBarChart.length])
            .range([0, width]);

        var yScale = d3.scaleLinear()
            .domain([0, d3.max(firstDatasetBarChart, function(d) {
                return d.measure;
            })])
            .range([height, 0]);

        var svg = d3.select("#barChart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("id", "barChartPlot");

        var plot = svg
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        plot.selectAll("rect")
            .data(firstDatasetBarChart)
            .enter()
            .append("rect")
            .attr("x", function(d, i) {
                return xScale(i);
            })
            .attr("width", width / firstDatasetBarChart.length - barPadding)
            .attr("y", function(d) {
                return yScale(d.measure);
            })
            .attr("height", function(d) {
                return height - yScale(d.measure);
            })
            .attr("fill", "lightgrey");

        plot.selectAll("text")
            .data(firstDatasetBarChart)
            .enter()
            .append("text")
            .text(function(d) {
                return d.measure;
            })
            .attr("text-anchor", "middle")
            .attr("x", function(d, i) {
                return (i * (width / firstDatasetBarChart.length)) + ((width / firstDatasetBarChart.length - barPadding) / 2);
            })
            .attr("y", function(d) {
                return yScale(d.measure) + 14;
            })
            .attr("class", "yAxis");

        var xLabels = svg
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + (margin.top + height) + ")");

        xLabels.selectAll("text.xAxis")
            .data(firstDatasetBarChart)
            .enter()
            .append("text")
            .text(function(d) {
                return d.category;
            })
            .attr("text-anchor", "middle")
            .attr("x", function(d, i) {
                return (i * (width / firstDatasetBarChart.length)) + ((width / firstDatasetBarChart.length - barPadding) / 2);
            })
            .attr("y", 15)
            .attr("class", "xAxis");

        svg.append("text")
            .attr("x", (width + margin.left + margin.right) / 2)
            .attr("y", 15)
            .attr("class", "title")
            .attr("text-anchor", "middle")
            .text("Canberra's water usage breakdown since 2015");
    });
}


function updateBarChart(states, group, colorChosen) {

    var basics = dsBarChartBasics();

    var margin = basics.margin,
        width = basics.width,
        height = basics.height,
        colorBar = basics.colorBar,
        barPadding = basics.barPadding;

    d3.json("data/data.json", function(error, data) {
        var ds = []
        for (x in data) {
            if (data[x].state == states) {
                for (y in data[x].cities) {
                    if (data[x].cities[y].name == group) {
                        for (z in data[x].cities[y].data) {
                            var obj = {};
                            obj.category = data[x].cities[y].data[z].year;
                            obj.measure = data[x].cities[y].data[z].usage;
                            ds.push(obj);
                        }
                    }
                }
            }
        }

        console.log(ds);
        currentDatasetBarChart = ds;

        var xScale = d3.scaleLinear()
            .domain([0, currentDatasetBarChart.length])
            .range([0, width]);


        var yScale = d3.scaleLinear()
            .domain([0, d3.max(currentDatasetBarChart, function(d) {
                return d.measure;
            })])
            .range([height, 0]);

        var svg = d3.select("#barChart svg");

        var plot = d3.select("#barChartPlot")
            .datum(currentDatasetBarChart);

        plot.selectAll("rect")
            .data(currentDatasetBarChart)
            .transition()
            .duration(750)
            .attr("x", function(d, i) {
                return xScale(i);
            })
            .attr("width", width / currentDatasetBarChart.length - barPadding)
            .attr("y", function(d) {
                return yScale(d.measure);
            })
            .attr("height", function(d) {
                return height - yScale(d.measure);
            })
            .attr("fill", colorChosen);

        plot.selectAll("text.yAxis")
            .data(currentDatasetBarChart)
            .transition()
            .duration(750)
            .attr("text-anchor", "middle")
            .attr("x", function(d, i) {
                return (i * (width / currentDatasetBarChart.length)) + ((width / currentDatasetBarChart.length - barPadding) / 2);
            })
            .attr("y", function(d) {
                return yScale(d.measure) + 14;
            })
            .text(function(d) {
                return d.measure;
            })
            .attr("class", "yAxis");


        svg.selectAll("text.title")
            .attr("x", (width + margin.left + margin.right) / 2)
            .attr("y", 15)
            .attr("class", "title")
            .attr("text-anchor", "middle")
            .text(group + "'s water usage breakdown since 2015");
    });
}