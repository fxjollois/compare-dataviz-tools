/*global console,d3,data */
var file = "HadCRUT4-gl.dat";

function createEvolution(container, data) {
    "use strict";
    
    function getArrayMonths(obj) {
        return Object.keys(obj).slice(1, 13).map(function (k) {
            return obj[k];
        });
    }
    
    // Graphical properties
    var width = 800,
        height = 600,
        margin = {bottom: 20, left: 60, top: 10, right: 10},
        widthInside = width - margin.left - margin.right,
        heightInside = height - margin.top - margin.bottom,

        // SVG containing the evolution line-chart
        evolution = container.append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")"),

        // x and y scale
        x = d3.scaleLinear()
            .rangeRound([0, widthInside]),
        y = d3.scaleLinear()
            .rangeRound([heightInside, 0]),

        // Line definition 
        line = d3.line()
            .x(function (d) { return x(d.Year); })
            .y(function (d) { return y(d.Annual); }),
        
        // Area definition for annual min/max interval
        area = d3.area()
            .x(function (d) { return x(d.Year); })
            .y0(function (d) { return y(d3.min(getArrayMonths(d))); })
            .y1(function (d) { return y(d3.max(getArrayMonths(d))); });
    
    // Y Axis label
    evolution.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left)
        .attr("x", -(heightInside / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Temperature anomaly");
    
    
    x.domain(d3.extent(data, function (d) { return d.Year; }));
    y.domain([
        d3.min(data, function (d) { return d3.min(getArrayMonths(d)); }),
        d3.max(data, function (d) { return d3.max(getArrayMonths(d)); })
    ]);
    
    console.log(x.range());
    console.log(x.domain());
    console.log(y.range());
    console.log(y.domain());

    // Reference period indication
    evolution.append("rect")
        .attr("x", x(1961))
        .attr("width", x(1990) - x(1960))
        .attr("y", 0)
        .attr("height", heightInside)
        .attr("fill", "#eee");
    evolution.append("text")
        .attr("x", x(1961)).attr("dx", 5)
        .attr("y", heightInside).attr("dy", -5)
        .style("font-size", ".75em")
        .text("Reference period");

    // 0 reference line
    evolution.append("line")
        .attr("x1", 0).attr("x2", widthInside)
        .attr("y1", y(0)).attr("y2", y(0))
        .attr("stroke", "#ccc")
        .attr("stroke-dasharray", "10,5");

    // Annual min/max interval
    evolution.append("path")
        .datum(data)
        .attr("fill", "lightblue")
        .attr("d", area);

    // Anomaly line
    evolution.append("path")
        .datum(data).attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line);

    // Add X and Y axis
    evolution.append("g")
        .attr("transform", "translate(0," + heightInside + ")")
        .call(d3.axisBottom(x).tickFormat(d3.format(".0f")));

    evolution.append("g")
        .call(d3.axisLeft(y));
}

createEvolution(d3.select("#evolution"), data);