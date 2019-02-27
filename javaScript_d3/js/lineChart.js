function dsLineChartBasics() {

    var margin = {
            top: 30,
            right: 20,
            bottom: 0,
            left: 50
        },
        width = 500 - margin.left - margin.right,
        height = 150 - margin.top - margin.bottom;

    return {
        margin: margin,
        width: width,
        height: height
    };
}


function dsLineChart(states, group) {

    d3.json("data/data.json", function(error, data) {
        var ds = []
        for (x in data) {
            if (data[x].state == states) {
                for (y in data[x].cities) {
                    if (data[x].cities[y].name == group) {
                        for (z in data[x].cities[y].data) {
                            var obj = {};
                            obj.category = data[x].cities[y].data[z].year;
                            obj.measure = data[x].cities[y].data[z].cost;
                            ds.push(obj);
                        }
                    }
                }
            }
        }

        console.log(ds);
        firstDatasetLineChart = ds;

        var basics = dsLineChartBasics();

        var margin = basics.margin,
            width = basics.width,
            height = basics.height;

        var xScale = d3.scaleLinear()
            .domain([0, firstDatasetLineChart.length - 1])
            .range([0, width]);

        var yScale = d3.scaleLinear()
            .domain([0, d3.max(firstDatasetLineChart, function(d) {
                return d.measure;
            })])
            .range([height, 0]);

        var line = d3.line()
            .x(function(d, i) {
                return xScale(i);
            })
            .y(function(d) {
                return yScale(d.measure);
            });

        var lblline = d3.line()
            .x(function(d, i) {
                return xScale(i) - 15;
            })
            .y(function(d) {
                return yScale(d.measure) + 15;
            });

        var svg = d3.select("#lineChart")
            .append("svg")
            .datum(firstDatasetLineChart)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)

        var plot = svg
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr("id", "lineChartPlot");

        plot.append("path")
            .attr("class", "line")
            .attr("d", line)
            // add color
            .attr("stroke", "lightgrey");

        plot.selectAll(".dot")
            .data(firstDatasetLineChart)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("fill", function(d) {
                return d.measure == d3.min(firstDatasetLineChart, function(d) {
                    return d.measure;
                }) ? "red" : (d.measure == d3.max(firstDatasetLineChart, function(d) {
                    return d.measure;
                }) ? "green" : "white")
            })
            .attr("cx", line.x())
            .attr("cy", line.y())
            .attr("r", 5)
            .attr("stroke", "lightgrey")
            .append("title")
            .text(function(d) {
                return "Total cost in year " + d.category + ": " + d.measure * 100 + " AUD";
            });

        var txt = plot.selectAll("text")
            .data(firstDatasetLineChart)
            .enter()
            .append("text")

        txt.attr("x", lblline.x())
            .attr("y", lblline.y())
            .text(function(d) {
                return d.measure;
            })
            .attr("id", "lineChartTexts");

        svg.append("text")
            .text("Total cost since 2015 (*100 AUD)")
            .attr("dy", ".35em")
            .attr("id", "lineChartTitle1")
            .attr("x", margin.left + ((width + margin.right) / 2))
            .attr("y", 10);
    });

}

function updateLineChart(states, group, colorChosen) {
    var basics = dsLineChartBasics();

    var margin = basics.margin,
        width = basics.width,
        height = basics.height;


    d3.json("data/data.json", function(error, data) {
        var ds = []
        for (x in data) {
            if (data[x].state == states) {
                for (y in data[x].cities) {
                    if (data[x].cities[y].name == group) {
                        for (z in data[x].cities[y].data) {
                            var obj = {};
                            obj.category = data[x].cities[y].data[z].year;
                            obj.measure = data[x].cities[y].data[z].cost;
                            ds.push(obj);
                        }
                    }
                }
            }
        }

        currentDatasetLineChart = ds

        var xScale = d3.scaleLinear()
            .domain([0, currentDatasetLineChart.length - 1])
            .range([0, width]);

        var yScale = d3.scaleLinear()
            .domain([0, d3.max(currentDatasetLineChart, function(d) {
                return d.measure;
            })])
            .range([height, 0]);

        var line = d3.line()
            .x(function(d, i) {
                return xScale(i);
            })
            .y(function(d) {
                return yScale(d.measure);
            });

        var lblline = d3.line()
            .x(function(d, i) {
                return xScale(i) - 15;
            })
            .y(function(d) {
                return yScale(d.measure) + 15;
            });

        var plot = d3.select("#lineChartPlot")
            .datum(currentDatasetLineChart);

        plot
            .select("path")
            .transition()
            .duration(750)
            .attr("class", "line")
            .attr("d", line)
            .attr("stroke", colorChosen);

        var path = plot
            .selectAll(".dot")
            .data(currentDatasetLineChart)
            .transition()
            .duration(750)
            .attr("class", "dot")
            .attr("fill", function(d) {
                return d.measure == d3.min(currentDatasetLineChart, function(d) {
                    return d.measure;
                }) ? "red" : (d.measure == d3.max(currentDatasetLineChart, function(d) {
                    return d.measure;
                }) ? "green" : "white")
            })
            .attr("cx", line.x())
            .attr("cy", line.y())
            .attr("r", 5)
            .attr("stroke", colorChosen)

        plot.selectAll("text")
            .data(currentDatasetLineChart)
            .transition()
            .duration(800)
            .attr("x", lblline.x())
            .attr("y", lblline.y())
            .text(function(d) {
                return d.measure;
            })
            .attr("id", "lineChartTexts");


        path
            .select("title")
            .text(function(d) {
                return "Total cost in year " + d.category + ": " + d.measure * 100 + " AUD";
            });
    });
}