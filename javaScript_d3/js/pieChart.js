function dsPieChart(states) {

    d3.json("data/data.json", function(error, data) {
        var ds = []
        for (x in data) {
            if (data[x].state == states) {
                for (y in data[x].cities) {
                    var name = data[x].cities[y].name;
                    var usage = 0;
                    for (z in data[x].cities[y].data) {
                        usage = usage + data[x].cities[y].data[z].usage;
                    }
                    var obj = {};
                    obj.category = name;
                    obj.measure = usage;
                    ds.push(obj)
                }
            }
        }

        console.log(ds);

        var width = 400,
            height = 400,
            outerRadius = Math.min(width, height) / 2,
            innerRadius = outerRadius * .999,
            // for animation
            innerRadiusFinal = outerRadius * .5,
            innerRadiusFinal3 = outerRadius * .45,
            color = d3.scaleOrdinal(d3.schemeCategory10);

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
            .value(function(d) {
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
            .attr("fill", function(d, i) {
                return color(i);
            })
            .attr("d", arc)
            .append("svg:title")
            .text(function(d) {
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
            .attr("transform", function(d) {
                return "translate(" + arcFinal.centroid(d) + ")rotate(" + angle(d) + ")";
            })
            .text(function(d) {
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