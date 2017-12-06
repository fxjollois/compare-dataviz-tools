/*global data,Plotly*/

function createEvolution(container, data) {
    "use strict";
    
    var line = {
            x: data.map(function (e) { return (e.Year); }),
            y: data.map(function (e) { return (e.Annual); }),
            line: {
                color: "steelblue"
            },
            name: "Means"
        },
        lineUp = {
            x: data.map(function (e) { return (e.Year); }),
            y: data.map(function (e) { return (Math.max.apply(null, Object.keys(e).slice(1, 13).map(function (m) { return (e[m]); }))); }),
            line: {
                color: "lightblue"
            },
            name: "Maximum"
        },
        lineDown = {
            x: data.map(function (e) { return (e.Year); }),
            y: data.map(function (e) { return (Math.min.apply(null, Object.keys(e).slice(1, 13).map(function (m) { return (e[m]); }))); }),
            fill: "tonexty",
            line: {
                color: "lightblue"
            },
            name: "Minimum"
        },
        plots = [line, lineUp, lineDown],
        layout = {
            shapes: [{
                type: "rect",
                xref: "x",
                yref: "paper",
                x0: 1961,
                y0: 0,
                x1: 1990,
                y1: 1,
                fillcolor: "#ccc",
                opacity: 0.5,
                line: {
                    width: 0
                },
                layer: "below"
            }],
            yaxis: {
                title: "Temperature anomaly"
            },
            margin: {
                r: 10,
                t: 10,
                b: 20
            },
            showlegend: false
        };
    
    Plotly.plot(
        container,
        plots,
        layout
    );
}

createEvolution('evolution', data);
