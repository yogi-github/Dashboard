import * as d3 from "d3";

interface chartData{
    category:string;
    measure:number;
}

///////PIECHART/////////
function dsPieChart(states: string) {
    d3.json("data/data.json", function(error, data){
        let ds = []
        for (let x in data) {
            if (data[x].state == states) {
                for (let y in data[x].cities) {
                    let name: string = data[x].cities[y].name;
                    let usage: number = 0;
                    for (let z in data[x].cities[y].data) {
                        usage = usage + data[x].cities[y].data[z].usage;
                    }
                    let obj: chartData = <any>{};
                    obj.category = name;
                    obj.measure = usage;
                    ds.push(obj)
                }
            }
        }

        console.log(ds);

        let width: number = 400;
        let height: number = 400;
        let outerRadius: number = Math.min(width, height) / 2;
        let innerRadius: number = outerRadius * .999;
            // for animation
        let innerRadiusFinal: number = outerRadius * .5;
        let innerRadiusFinal3: number = outerRadius * .45;
        let color: any = d3.scaleOrdinal(d3.schemeCategory10);

        let vis = d3.select("#pieChart")
            .append("svg:svg")
            .data([ds])
            .attr("width", width)
            .attr("height", height)
            .append("svg:g")
            .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");

        let arc = d3.arc()
            .outerRadius(outerRadius).innerRadius(innerRadius);

        // for animation
        let arcFinal = d3.arc().innerRadius(innerRadiusFinal).outerRadius(outerRadius);
        let arcFinal3 = d3.arc().innerRadius(innerRadiusFinal3).outerRadius(outerRadius);

        let pie = d3.pie()
            .value(function(d : any): any {
                return d.measure;
            });

        let arcs = vis.selectAll("g.slice")
            .data(pie)
            .enter()
            .append("svg:g")
            .attr("class", "slice")
            .on("mouseover", mouseover)
            .on("mouseout", mouseout)
            .on("click", up);

        arcs.append("svg:path")
            .attr("fill", function(d, i) {
                return color(i);
            })
            .attr("d", <any>arc)
            .append("svg:title")
            .text(function(d: any): any {
                return "Water usage since 2015 by " + d.data.category + ": " + d.data.measure + " ML";
            });

        d3.selectAll("g.slice").selectAll("path").transition()
            .duration(750)
            .delay(10)
            .attr("d", arcFinal);

        arcs.filter(function(d) {
                return d.endAngle - d.startAngle > .2;
            })
            .append("svg:text")
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .attr("transform", function(d: any): any {
                return "translate(" + arcFinal.centroid(d) + ")rotate(" + angle(d) + ")";
            })
            .text(function(d: any): any {
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

    let margin = {
            top: 60,
            right: 5,
            bottom: 20,
            left: 50
        };
    let width = 500 - margin.left - margin.right;
    let height = 250 - margin.top - margin.bottom;
    let colorBar = d3.scaleOrdinal(d3.schemeCategory10);
    let barPadding = 1;

    return {
        margin: margin,
        width: width,
        height: height,
        colorBar: colorBar,
        barPadding: barPadding
    };
}

function dsBarChart(states: string, city: string) {

    d3.json("data/data.json", function(error, data) {
        let firstDatasetBarChart = []
        for (let x in data) {
            if (data[x].state == states) {
                for (let y in data[x].cities) {
                    if (data[x].cities[y].name == city) {
                        for (let z in data[x].cities[y].data) {
                            let obj: chartData = <any>{};
                            obj.category = data[x].cities[y].data[z].year;
                            obj.measure = data[x].cities[y].data[z].usage;
                            firstDatasetBarChart.push(obj);
                        }
                    }
                }
            }
        }

        console.log(firstDatasetBarChart);

        let basics = dsBarChartBasics();

        let margin: any = basics.margin;
        let width: number = basics.width;
        let height: number = basics.height;
        let colorBar: any = basics.colorBar;
        let barPadding: number = basics.barPadding;

        let xScale = d3.scaleLinear()
            .domain([0, firstDatasetBarChart.length])
            .range([0, width]);

        let yScale = d3.scaleLinear()
            .domain([0, d3.max(firstDatasetBarChart, function(d) {
                return d.measure;
            })])
            .range([height, 0]);

        let svg = d3.select("#barChart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("id", "barChartPlot");

        let plot = svg
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

        let xLabels = svg
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


function updateBarChart(states: string, group: string, colorChosen: string) {

    let basics = dsBarChartBasics();

    let margin: any = basics.margin;
    let width: number = basics.width;
    let height: number = basics.height;
    let colorBar: any = basics.colorBar;
    let barPadding: number = basics.barPadding;

    d3.json("data/data.json", function(error, data) {
        let currentDatasetBarChart = []
        for (let x in data) {
            if (data[x].state == states) {
                for (let y in data[x].cities) {
                    if (data[x].cities[y].name == group) {
                        for (let z in data[x].cities[y].data) {
                            let obj: chartData = <any>{};
                            obj.category = data[x].cities[y].data[z].year;
                            obj.measure = data[x].cities[y].data[z].usage;
                            currentDatasetBarChart.push(obj);
                        }
                    }
                }
            }
        }

        console.log(currentDatasetBarChart);

        let xScale = d3.scaleLinear()
            .domain([0, currentDatasetBarChart.length])
            .range([0, width]);


        let yScale = d3.scaleLinear()
            .domain([0, d3.max(currentDatasetBarChart, function(d) {
                return d.measure;
            })])
            .range([height, 0]);

        let svg = d3.select("#barChart svg");

        let plot = d3.select("#barChartPlot")
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

///////LINECHART/////////

function dsLineChartBasics() {

    let margin = {
            top: 30,
            right: 20,
            bottom: 0,
            left: 50
        };
    let width = 500 - margin.left - margin.right;
    let height = 150 - margin.top - margin.bottom;

    return {
        margin: margin,
        width: width,
        height: height
    };
}


function dsLineChart(states: string, group: string) {

    d3.json("data/data.json", function(error, data) {
        let firstDatasetLineChart = []
        for (let x in data) {
            if (data[x].state == states) {
                for (let y in data[x].cities) {
                    if (data[x].cities[y].name == group) {
                        for (let z in data[x].cities[y].data) {
                            let obj: chartData= <any>{};
                            obj.category = data[x].cities[y].data[z].year;
                            obj.measure = data[x].cities[y].data[z].cost;
                            firstDatasetLineChart.push(obj);
                        }
                    }
                }
            }
        }

        console.log(firstDatasetLineChart);

        let basics = dsLineChartBasics();

        let margin: any = basics.margin;
        let width: number = basics.width;
        let height: number = basics.height;

        let xScale = d3.scaleLinear()
            .domain([0, firstDatasetLineChart.length - 1])
            .range([0, width]);

        let yScale = d3.scaleLinear()
            .domain([0, d3.max(firstDatasetLineChart, function(d) {
                return d.measure;
            })])
            .range([height, 0]);

        let line = d3.line()
            .x(function(d, i) {
                return xScale(i);
            })
            .y(function(d: any): any {
                return yScale(d.measure);
            });

        let lblline = d3.line()
            .x(function(d, i) {
                return xScale(i) - 15;
            })
            .y(function(d: any): any {
                return yScale(d.measure) + 15;
            });

        let svg = d3.select("#lineChart")
            .append("svg")
            .datum(firstDatasetLineChart)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)

        let plot = svg
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
            .attr("cx", <any>line.x())
            .attr("cy", <any>line.y())
            .attr("r", 5)
            .attr("stroke", "lightgrey")
            .append("title")
            .text(function(d) {
                return "Total cost in year " + d.category + ": " + d.measure * 100 + " AUD";
            });

        let txt = plot.selectAll("text")
            .data(firstDatasetLineChart)
            .enter()
            .append("text")

        txt.attr("x", <any>lblline.x())
            .attr("y", <any>lblline.y())
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

function updateLineChart(states: string, group: string, colorChosen: any) {
    let basics = dsLineChartBasics();

    let margin: any = basics.margin;
    let width: number = basics.width;
    let height = basics.height;


    d3.json("data/data.json", function(error, data) {
        let currentDatasetLineChart = []
        for (let x in data) {
            if (data[x].state == states) {
                for (let y in data[x].cities) {
                    if (data[x].cities[y].name == group) {
                        for (let z in data[x].cities[y].data) {
                            let obj: chartData = <any>{};
                            obj.category = data[x].cities[y].data[z].year;
                            obj.measure = data[x].cities[y].data[z].cost;
                            currentDatasetLineChart.push(obj);
                        }
                    }
                }
            }
        }

        let xScale = d3.scaleLinear()
            .domain([0, currentDatasetLineChart.length - 1])
            .range([0, width]);

        let yScale = d3.scaleLinear()
            .domain([0, d3.max(currentDatasetLineChart, function(d) {
                return d.measure;
            })])
            .range([height, 0]);

        let line = d3.line()
            .x(function(d, i) {
                return xScale(i);
            })
            .y(function(d: any): any {
                return yScale(d.measure);
            });

        let lblline = d3.line()
            .x(function(d, i) {
                return xScale(i) - 15;
            })
            .y(function(d: any): any {
                return yScale(d.measure) + 15;
            });

        let plot = d3.select("#lineChartPlot")
            .datum(currentDatasetLineChart);

        plot
            .select("path")
            .transition()
            .duration(750)
            .attr("class", "line")
            .attr("d", line)
            .attr("stroke", colorChosen);

        let path = plot
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
            .attr("cx", <any>line.x())
            .attr("cy", <any>line.y())
            .attr("r", 5)
            .attr("stroke", colorChosen)

        plot.selectAll("text")
            .data(currentDatasetLineChart)
            .transition()
            .duration(800)
            .attr("x", <any>lblline.x())
            .attr("y", <any>lblline.y())
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

///////STARTPOINT/////////

dsPieChart("ACT");
dsBarChart("ACT", "Canberra");
dsLineChart("ACT", "Canberra");
