/*global console,d3 */
var file = "HadCRUT4-gl.dat";

function createEvolution(container, file) {
    "use strict";
    
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
            .x(function (d) { return x(d.year); })
            .y(function (d) { return y(d.annual); }),
        
        // Area definition for annual min/max interval
        area = d3.area()
            .x(function (d) { return x(d.year); })
            .y0(function (d) { return y(d3.min(d.months)); })
            .y1(function (d) { return y(d3.max(d.months)); });
    
    // Y Axis label
    evolution.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left)
        .attr("x", -(heightInside / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Temperature anomaly");
    
    d3.text(
        file,
        function (error, lines) {
            if (error) {
                d3.select("body").html("Error !!");
                throw error;
            }
            var data = d3.tsvParseRows(
                lines,
                function (line, index) {
                    var values;
                    if (index % 2 === 0) {
                        values = line[0].split(" ")
                            .filter(function (e) { return (e !== ""); })
                            .map(parseFloat);
                        return {
                            year: values[0],
                            annual: values[13],
                            months: values.slice(1, 13)
                        };
                    }
                }
            );
            
            x.domain(d3.extent(data, function (d) { return d.year; }));
            y.domain([
                d3.min(data, function (d) { return d3.min(d.months.concat(d.annual)); }),
                d3.max(data, function (d) { return d3.max(d.months.concat(d.annual)); })
            ]);
                        
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
    );
}

createEvolution(d3.select("#evolution"), file);