/* globals window, d3, _, document, Date, arguments  */


// https://bost.ocks.org/mike/chart/
(function (d3, document) {
    
    // if d3 is not loaded just return
    if (!d3) { return; }
    
    d3.util = {
        extend: function (target, source) {
            var pp;
            for (pp in source) {
                if (source.hasOwnProperty(pp)) {
                    target[pp] = source[pp];
                }
            }
            
            return target;
        },
        getTBox: function (texts, style) {
            if(!style) { style = {"font": "12px arial, sans-serif"}; }
            var svg = d3.select(document.body)
                .append("svg")
                .style({
                    display : "block",
                    position: "absolute",
                    left    : "-1000000px"
                })
                .style(style)
                .attr({ width: 100, height: 100 });
            
            var msg = null, box;
            
            // if texts is an array of text
            if (Array.isArray(texts)) {
                msg = [];
                svg.selectAll("text")
                    .data(texts)
                    .enter()
                    .append("text")
                    .text(function(d){ return d; })
                    .each(function(d){
                        box = this.getBBox();
                        msg.push({ text: d, width: box.width, height: box.height });
                    });
            }
            
            // if texts is a string
            if ((typeof texts) === "string") {
                box = svg.append("text").text(texts).node().getBBox();
                msg = { text: texts, width: box.width, height: box.height };
            }
            
            // remove svg element after finish
            svg.remove();
            
            return msg;
        },
        legend: legend,
        streamLegend: streamLegend
    };



    function legend () {
        var width      = null,
            height     = null,
            fontStyle  = {"font": "12px arial, sans-serif"},
            rowHeight  = 0, // can not configurable
            textHeight = 0, // can not configurable
            rowSpan    = 5,
            title      = "",
            
            symbol     = "square", // string or accessor function
            symbolSize = 64,
            symRight   = 5,
            color      = "blue", // string or accessor function

            data       = [],
            dataAcc    = function (d) { return d; };
        
        var sym = d3.svg.symbol();

        function draw (ss) {
            if (!data.length) { return; }
            //var ss = d3.select(this);
            
            var tt = 0;
            if (title.length > 1) {
                tt = textHeight + rowSpan;
                ss.append("text")
                    .style("font", fontStyle)
                    .text(title)
                    .attr("transform", "translate(0," + textHeight + ")");
            }
            
            ss.style(fontStyle)
              .selectAll("g")
              .data(data)
              .enter()
              .append("g")
              
              .each(function (dd, ii) {
                 var self = d3.select(this);
                 self.attr("transform", "translate(0," + (ii * (rowHeight + rowSpan) + tt + rowSpan) + ")");
                 
                 self.append("path").attr({
                     fill     : typeof color === "string" ? color : color(dd, ii),
                     transform: "translate(" + (Math.sqrt(symbolSize) * 0.5) + ",0)",
                     d        : sym.type(typeof symbol === "string" ? symbol : symbol(dd, ii)).size(symbolSize)()
                 });
                
                 self.append("text")
                     .text(dataAcc)
                     .attr("transform", "translate(" +
                           [Math.sqrt(symbolSize) + symRight, Math.sqrt(symbolSize) * 0.5] +
                           ")");
              });
        }

        draw.fontStyle = function (val) {
            if (!arguments.length) { return fontStyle; }

            fontStyle = val;
            draw.flush();
            return draw;
        };

        draw.rowSpan = function (val) {
            if (!arguments.length) { return rowSpan; }

            rowSpan = val;
            draw.flush();
            return draw;
        };
        draw.title = function (val) {
            if (!arguments.length || (typeof val !== "string")  || (val.length < 1)) { return title; }

            title = val.trim();
            draw.flush();
            return draw;
        };
        
        draw.symbol = function (val) {
            if (!arguments.length) { return symbol; }

            symbol = val;
            return draw;
        };

        draw.symbolSize = function (val) {
            if (!arguments.length) { return symbolSize; }

            symbolSize = val;
            draw.flush();
            return draw;
        };
        
        draw.symRight = function (val) {
            if (!arguments.length) { return symRight; }

            symRight = val;
            draw.flush();
            return draw;
        };
        
        draw.color = function (val) {
            if (!arguments.length) { return color; }

            color = val;
            draw.flush();
            return draw;
        };
        
        draw.data = function (array, accessor) {
            if (!arguments.length) { return data; }

            data = array;
            if ((typeof accessor) === "function") { dataAcc = accessor; }
            draw.flush();
            return draw;
        };

        // erase "width" & "heigth" properties which should be re-calculated
        draw.flush = function () {
            width  = null;
            height = null;
        };
        
        draw.getWidth = function () {
            // retrun the cached value
            if (width) { return width; }
            
            var textBox, titleBox;
            textBox = d3.util.getTBox(data.map(dataAcc), fontStyle);
            titleBox = d3.util.getTBox(title, fontStyle);
            
            textHeight = textBox[0].height;
            rowHeight = Math.max(textHeight, Math.sqrt(symbolSize));
            
            width = Math.max(titleBox.width,
                      d3.max(textBox.map(function(d){ return d.width; })) + Math.sqrt(symbolSize) + symRight);
            
            return width;
        };
        
        draw.getHeight = function () {
            // retrun the cached value
            if (height) { return height; }
            
            if (rowHeight) { draw.getWidth(); }
            height = textHeight + (rowHeight + rowSpan) * data.length + 0.5 * Math.sqrt(symbolSize);
            return height;
        };
        
        return draw;
    }
    
    function streamLegend () {
        var width = 100,
            height = 100;
        
        function draw (ss) {}
        
        return draw;
    }

    function GradientBar (opt) {}


})(d3, document);

















































