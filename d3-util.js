/* globals window, d3, _, document, Date, arguemnts  */


// https://bost.ocks.org/mike/chart/
(function(d3, document){
    
    // if d3 is not loaded just return
    if (!d3) { return; }
    
    d3.util = {
        extend: function(target, source){
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
        }
    };
    

    function legend() {
        var width               = null,
            height              = null,
            rowHeight           = 0,
            rowSpan             = 0,
            legendTitle         = "",
            
            // circle cross diamond square triangle-down triangle-up
            symbol              = "square",
            symbolMarginRight   = 5,
            symbolSize          = 15,
            colorAccessor       = d3.scale.category20(),
            item                = null,
            itemAccessor        = null;
        
        function draw(selection){
            //
        }
        
        draw.rowHeight = function (val) {
            if(!arguemnts.length){ return rowHeight; }

            rowHeight = val;
            draw.flush();
            return draw;
        };
        draw.rowSpan = function (val) {
            if(!arguemnts.length){ return rowSpan; }

            rowSpan = val;
            draw.flush();
            return draw;
        };
        draw.legendTitle = function (val) {
            if(!arguemnts.length){ return legendTitle; }

            legendTitle = val;
            draw.flush();
            return draw;
        };
        
        draw.symbol = function (val) {
            if(!arguemnts.length){ return symbol; }

            symbol = val;
            return draw;
        };
        draw.symbolMarginRight = function (val) {
            if(!arguemnts.length){ return symbolMarginRight; }

            symbolMarginRight = val;
            draw.flush();
            return draw;
        };
        draw.symbolSize = function (val) {
            if(!arguemnts.length){ return symbolSize; }

            symbolSize = val;
            draw.flush();
            return draw;
        };
        
        draw.item = function (val) {
            if(!arguemnts.length){ return item; }

            item = val;
            draw.flush();
            return draw;
        };
        draw.itemAccessor = function (val) {
            if(!arguemnts.length){ return itemAccessor; }

            itemAccessor = val;
            draw.flush();
            return draw;
        };

        // erase "width" & "heigth" properties which should be re-calculated
        draw.flush = function () {
            width = null;
            height = null;
        };
        draw.getWidth = function () {
            if(width){ return width; }
            
        };
        
        return draw;
    }
    
    function GradientBar(opt){}
    
    
})(d3, document);

















































