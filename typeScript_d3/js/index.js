"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//var d3 = require("d3");
///////PIECHART/////////
function dsPieChart(states) {
    d3.json("data/data.json", function (error, data) {
        var ds = [];
        for (var x in data) {
            if (data[x].state == states) {
                for (var y in data[x].cities) {
                    var name_1 = data[x].cities[y].name;
                    var usage = 0;
                    for (var z in data[x].cities[y].data) {
                        usage = usage + data[x].cities[y].data[z].usage;
                    }
                    var obj = {};
                    obj.category = name_1;
                    obj.measure = usage;
                    ds.push(obj);
                }
            }
        }
        console.log(ds);
        var width = 400;
        var height = 400;
        var outerRadius = Math.min(width, height) / 2;
        var innerRadius = outerRadius * .999;
        // for animation
        var innerRadiusFinal = outerRadius * .5;
        var innerRadiusFinal3 = outerRadius * .45;
        var color = d3.scaleOrdinal(d3.schemeCategory10);
        var vis = d3.select("#pieChart")
            .append("svg:svg")
            .data([ds])
            .attr("width", width)
            .attr("height", height)
            .append("svg:g")
            .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");
        var arc = d3.arc()
            .outerRadius(outerRadius).innerRadius(innerRadius);
        // for animation
        var arcFinal = d3.arc().innerRadius(innerRadiusFinal).outerRadius(outerRadius);
        var arcFinal3 = d3.arc().innerRadius(innerRadiusFinal3).outerRadius(outerRadius);
        var pie = d3.pie()
            .value(function (d) {
            return d.measure;
        });
        var arcs = vis.selectAll("g.slice")
            .data(pie)
            .enter()
            .append("svg:g")
            .attr("class", "slice")
            .on("mouseover", mouseover)
            .on("mouseout", mouseout)
            .on("click", up);
        arcs.append("svg:path")
            .attr("fill", function (d, i) {
            return color(i);
        })
            .attr("d", arc)
            .append("svg:title")
            .text(function (d) {
            return "Water usage since 2015 by " + d.data.category + ": " + d.data.measure + " ML";
        });
        d3.selectAll("g.slice").selectAll("path").transition()
            .duration(750)
            .delay(10)
            .attr("d", arcFinal);
        arcs.filter(function (d) {
            return d.endAngle - d.startAngle > .2;
        })
            .append("svg:text")
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .attr("transform", function (d) {
            return "translate(" + arcFinal.centroid(d) + ")rotate(" + angle(d) + ")";
        })
            .text(function (d) {
            return d.data.category;
        });
        function angle(d) {
            var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
            return a > 90 ? a - 180 : a;
        }
        vis.append("svg:text")
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .text("Total Water Usage")
            .attr("class", "title");
        function mouseover() {
            d3.select(this).select("path").transition()
                .duration(750)
                .attr("d", arcFinal3);
        }
        function mouseout() {
            d3.select(this).select("path").transition()
                .duration(750)
                .attr("d", arcFinal);
        }
        function up(d, i) {
            updateBarChart(states, d.data.category, color(i));
            updateLineChart(states, d.data.category, color(i));
        }
    });
}
///////BARCHART/////////
function dsBarChartBasics() {
    var margin = {
        top: 60,
        right: 5,
        bottom: 20,
        left: 50
    };
    var width = 500 - margin.left - margin.right;
    var height = 250 - margin.top - margin.bottom;
    var colorBar = d3.scaleOrdinal(d3.schemeCategory10);
    var barPadding = 1;
    return {
        margin: margin,
        width: width,
        height: height,
        colorBar: colorBar,
        barPadding: barPadding
    };
}
function dsBarChart(states, city) {
    d3.json("data/data.json", function (error, data) {
        var firstDatasetBarChart = [];
        for (var x in data) {
            if (data[x].state == states) {
                for (var y in data[x].cities) {
                    if (data[x].cities[y].name == city) {
                        for (var z in data[x].cities[y].data) {
                            var obj = {};
                            obj.category = data[x].cities[y].data[z].year;
                            obj.measure = data[x].cities[y].data[z].usage;
                            firstDatasetBarChart.push(obj);
                        }
                    }
                }
            }
        }
        console.log(firstDatasetBarChart);
        var basics = dsBarChartBasics();
        var margin = basics.margin;
        var width = basics.width;
        var height = basics.height;
        var colorBar = basics.colorBar;
        var barPadding = basics.barPadding;
        var xScale = d3.scaleLinear()
            .domain([0, firstDatasetBarChart.length])
            .range([0, width]);
        var yScale = d3.scaleLinear()
            .domain([0, d3.max(firstDatasetBarChart, function (d) {
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
            .attr("x", function (d, i) {
            return xScale(i);
        })
            .attr("width", width / firstDatasetBarChart.length - barPadding)
            .attr("y", function (d) {
            return yScale(d.measure);
        })
            .attr("height", function (d) {
            return height - yScale(d.measure);
        })
            .attr("fill", "lightgrey");
        plot.selectAll("text")
            .data(firstDatasetBarChart)
            .enter()
            .append("text")
            .text(function (d) {
            return d.measure;
        })
            .attr("text-anchor", "middle")
            .attr("x", function (d, i) {
            return (i * (width / firstDatasetBarChart.length)) + ((width / firstDatasetBarChart.length - barPadding) / 2);
        })
            .attr("y", function (d) {
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
            .text(function (d) {
            return d.category;
        })
            .attr("text-anchor", "middle")
            .attr("x", function (d, i) {
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
    var margin = basics.margin;
    var width = basics.width;
    var height = basics.height;
    var colorBar = basics.colorBar;
    var barPadding = basics.barPadding;
    d3.json("data/data.json", function (error, data) {
        var currentDatasetBarChart = [];
        for (var x in data) {
            if (data[x].state == states) {
                for (var y in data[x].cities) {
                    if (data[x].cities[y].name == group) {
                        for (var z in data[x].cities[y].data) {
                            var obj = {};
                            obj.category = data[x].cities[y].data[z].year;
                            obj.measure = data[x].cities[y].data[z].usage;
                            currentDatasetBarChart.push(obj);
                        }
                    }
                }
            }
        }
        console.log(currentDatasetBarChart);
        var xScale = d3.scaleLinear()
            .domain([0, currentDatasetBarChart.length])
            .range([0, width]);
        var yScale = d3.scaleLinear()
            .domain([0, d3.max(currentDatasetBarChart, function (d) {
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
            .attr("x", function (d, i) {
            return xScale(i);
        })
            .attr("width", width / currentDatasetBarChart.length - barPadding)
            .attr("y", function (d) {
            return yScale(d.measure);
        })
            .attr("height", function (d) {
            return height - yScale(d.measure);
        })
            .attr("fill", colorChosen);
        plot.selectAll("text.yAxis")
            .data(currentDatasetBarChart)
            .transition()
            .duration(750)
            .attr("text-anchor", "middle")
            .attr("x", function (d, i) {
            return (i * (width / currentDatasetBarChart.length)) + ((width / currentDatasetBarChart.length - barPadding) / 2);
        })
            .attr("y", function (d) {
            return yScale(d.measure) + 14;
        })
            .text(function (d) {
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
///////LINECHART/////////
function dsLineChartBasics() {
    var margin = {
        top: 30,
        right: 20,
        bottom: 0,
        left: 50
    };
    var width = 500 - margin.left - margin.right;
    var height = 150 - margin.top - margin.bottom;
    return {
        margin: margin,
        width: width,
        height: height
    };
}
function dsLineChart(states, group) {
    d3.json("data/data.json", function (error, data) {
        var firstDatasetLineChart = [];
        for (var x in data) {
            if (data[x].state == states) {
                for (var y in data[x].cities) {
                    if (data[x].cities[y].name == group) {
                        for (var z in data[x].cities[y].data) {
                            var obj = {};
                            obj.category = data[x].cities[y].data[z].year;
                            obj.measure = data[x].cities[y].data[z].cost;
                            firstDatasetLineChart.push(obj);
                        }
                    }
                }
            }
        }
        console.log(firstDatasetLineChart);
        var basics = dsLineChartBasics();
        var margin = basics.margin;
        var width = basics.width;
        var height = basics.height;
        var xScale = d3.scaleLinear()
            .domain([0, firstDatasetLineChart.length - 1])
            .range([0, width]);
        var yScale = d3.scaleLinear()
            .domain([0, d3.max(firstDatasetLineChart, function (d) {
                return d.measure;
            })])
            .range([height, 0]);
        var line = d3.line()
            .x(function (d, i) {
            return xScale(i);
        })
            .y(function (d) {
            return yScale(d.measure);
        });
        var lblline = d3.line()
            .x(function (d, i) {
            return xScale(i) - 15;
        })
            .y(function (d) {
            return yScale(d.measure) + 15;
        });
        var svg = d3.select("#lineChart")
            .append("svg")
            .datum(firstDatasetLineChart)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);
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
            .attr("fill", function (d) {
            return d.measure == d3.min(firstDatasetLineChart, function (d) {
                return d.measure;
            }) ? "red" : (d.measure == d3.max(firstDatasetLineChart, function (d) {
                return d.measure;
            }) ? "green" : "white");
        })
            .attr("cx", line.x())
            .attr("cy", line.y())
            .attr("r", 5)
            .attr("stroke", "lightgrey")
            .append("title")
            .text(function (d) {
            return "Total cost in year " + d.category + ": " + d.measure * 100 + " AUD";
        });
        var txt = plot.selectAll("text")
            .data(firstDatasetLineChart)
            .enter()
            .append("text");
        txt.attr("x", lblline.x())
            .attr("y", lblline.y())
            .text(function (d) {
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
    var margin = basics.margin;
    var width = basics.width;
    var height = basics.height;
    d3.json("data/data.json", function (error, data) {
        var currentDatasetLineChart = [];
        for (var x in data) {
            if (data[x].state == states) {
                for (var y in data[x].cities) {
                    if (data[x].cities[y].name == group) {
                        for (var z in data[x].cities[y].data) {
                            var obj = {};
                            obj.category = data[x].cities[y].data[z].year;
                            obj.measure = data[x].cities[y].data[z].cost;
                            currentDatasetLineChart.push(obj);
                        }
                    }
                }
            }
        }
        var xScale = d3.scaleLinear()
            .domain([0, currentDatasetLineChart.length - 1])
            .range([0, width]);
        var yScale = d3.scaleLinear()
            .domain([0, d3.max(currentDatasetLineChart, function (d) {
                return d.measure;
            })])
            .range([height, 0]);
        var line = d3.line()
            .x(function (d, i) {
            return xScale(i);
        })
            .y(function (d) {
            return yScale(d.measure);
        });
        var lblline = d3.line()
            .x(function (d, i) {
            return xScale(i) - 15;
        })
            .y(function (d) {
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
            .attr("fill", function (d) {
            return d.measure == d3.min(currentDatasetLineChart, function (d) {
                return d.measure;
            }) ? "red" : (d.measure == d3.max(currentDatasetLineChart, function (d) {
                return d.measure;
            }) ? "green" : "white");
        })
            .attr("cx", line.x())
            .attr("cy", line.y())
            .attr("r", 5)
            .attr("stroke", colorChosen);
        plot.selectAll("text")
            .data(currentDatasetLineChart)
            .transition()
            .duration(800)
            .attr("x", lblline.x())
            .attr("y", lblline.y())
            .text(function (d) {
            return d.measure;
        })
            .attr("id", "lineChartTexts");
        path
            .select("title")
            .text(function (d) {
            return "Total cost in year " + d.category + ": " + d.measure * 100 + " AUD";
        });
    });
}
///////STARTPOINT/////////
dsPieChart("ACT");
dsBarChart("ACT", "Canberra");
dsLineChart("ACT", "Canberra");
//# sourceMappingURL=index.js.map