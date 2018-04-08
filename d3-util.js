/* globals window, d3, _, document, Date, arguments  */


// https://bost.ocks.org/mike/chart/
(function (d3, document) {
    
    if (!d3 || !d3.version.match(/3[.\d]+/)) {
        return console.log("%cd3 is not loaded or not the version of \"3.x\"!",
                           "background: green; color: red; font-size: 30px;");
    }
    
    // In case of multipe reload
    if (d3.util) { return; }
    
    
    /* ------------ utility functions ------------ */
    // shallow copy properties form "source" to "target"
    var extend  = function (target, source) {
        var pp;
        for (pp in source) {
            if (source.hasOwnProperty(pp)) {
                target[pp] = source[pp];
            }
        }
        return target;
    };
    
    // getBBox from one or more texts
    var getTBox = function (texts, style) {
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
            if (texts.map) {
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
        };
    
    // constructor "T" inherited from constructor "S" 
    var inherit = function (T, S) {
        function F () {}
        F.prototype = S.prototype;
        T.prototype = new F();
        T.prototype.constructor = T;
    };
    var sqrt = Math.sqrt;
    
    // base legend constructior
    function BaseLegend () {
        this._width      = null;
        this._height     = null;
        this._fontStyle  = {"font": "12px arial, sans-serif"};
        this._rowHeight  = 0; // un-configurable
        this._textHeight = 0; // un-configurable
        this._rowSpan    = 5;
        this._title      = "";

        this._symbol     = "square"; // string or accessor function
        this._symbolSize = 64;
        this._symRight   = 5;
        this._color      = "blue";   // string or accessor function

        this._data       = [];
        this._dataAcc    = function (d) { return d; };
    }

    BaseLegend.prototype.fontStyle = function (val) {
        if (!arguments.length) { return this._fontStyle; }

        this._fontStyle = val;
        this.flush();
        return this;
    };
    
    BaseLegend.prototype.rowSpan = function (val) {
        if (!arguments.length) { return this._rowSpan; }

        this._rowSpan = val;
        this.flush();
        return this;
    };

    BaseLegend.prototype.title = function (val) {
        if (!arguments.length || (typeof val !== "string")  || (val.length < 1)) {
                return this._title;
        }

        this._title = val.trim();
        this.flush();
        return this;
    };

    BaseLegend.prototype.symbol = function (val) {
        if (!arguments.length) { return this._symbol; }

        this._symbol = val;
        return this;
    };

    BaseLegend.prototype.symbolSize = function (val) {
        if (!arguments.length) { return this._symbolSize; }

        this._symbolSize = val;
        this.flush();
        return this;
    };

    BaseLegend.prototype.symRight = function (val) {
        if (!arguments.length) { return this._symRight; }

        this._symRight = val;
        this.flush();
        return this;
    };

    BaseLegend.prototype.color = function (val) {
        if (!arguments.length) { return this._color; }

        this._color = val;
        return this;
    };

    BaseLegend.prototype.data = function (arr, accessor) {
        if (!arguments.length || !arr.map) { return this._data; }

        this._data = arr;
        if ((typeof accessor) === "function") { this._dataAcc = accessor; }
        this.flush();
        return this;
    };

    // erase "width" & "heigth" properties which should be re-calculated
    BaseLegend.prototype.flush = function () {
        this._width  = null;
        this._height = null;
    };




    /* ---------- legend vertical layout ---------- */
    function VerticalLegend () {
        BaseLegend.apply(this, Array.prototype.slice(arguments));
    }

    inherit(VerticalLegend, BaseLegend);

    VerticalLegend.prototype.size = function () {
        if (this._width) {
            return { width: this._width, height: this._height };
        }

        var textBox, titleBox;
        textBox  = getTBox(this._data.map(this._dataAcc), this._fontStyle);
        titleBox = getTBox(this._title, this._fontStyle);

        this._textHeight = textBox[0].height;
        this._rowHeight  = Math.max(this._textHeight, sqrt(this._symbolSize));

        this._width = Math.max(titleBox.width,
                d3.max(textBox.map(function(d){ return d.width; })) +
                sqrt(this._symbolSize) +
                this._symRight);
        this._height = this._textHeight +
                (this._rowHeight + this._rowSpan) * this._data.length +
                0.5 * sqrt(this._symbolSize);

        return { width: this._width, height: this._height };
    };

    function verticalDraw (ss) {
        if (!this._data.length) { return; }

        var sym = d3.svg.symbol();
        var ts = this, tt = 0;

        if (this._title.length > 0) {
            tt = this._textHeight + this._rowSpan;
            ss.append("text")
                .text(this._title)
                .attr("transform", "translate(0," + this._textHeight + ")");
        }

        ss.style(this._fontStyle)
          .selectAll("g")
          .data(this._data)
          .enter()
          .append("g")
          .each(function (dd, ii) {
             var self = d3.select(this);

             sym.type(typeof ts._symbol === "string" ? ts._symbol : ts._symbol(dd, ii))
                .size(ts._symbolSize);

             self.attr("transform",
                    "translate(0," + (ii * (ts._rowHeight + ts._rowSpan) + tt + ts._rowSpan) + ")");
             self.append("path").attr({
                 fill      : typeof ts._color === "string" ? ts._color : ts._color(dd, ii),
                 transform : "translate(" + (sqrt(ts._symbolSize) * 0.5) + ",0)",
                 d         : sym()
             });

             self.append("text")
                 .text(dd.text)
                 .attr("transform", "translate(" +
                       [sqrt(ts._symbolSize) + ts._symRight, sqrt(ts._symbolSize) * 0.5] +
                       ")");
          });
    }


    
    /* ---------- stream layout legend ---------- */
    function StreamLegend () {
        BaseLegend.apply(this, Array.prototype.slice(arguments));
        
        // overwrite the default "_width"
        this._width    = 150;
        
        // add new properties
        this._nodes    = [];
        this._itemSpan = 5;
        this._row      = 1;
    }
    inherit(StreamLegend, BaseLegend);
    
    StreamLegend.prototype.size = function () {
        if (!this._data.length) { return null; }

        if (this._height && this._nodes.length) {
            return { width: this._width, height: this._height };
        }
        this.getNodes();
        this._height = this._row * (this._rowHeight + this._rowSpan);

        return { width: this._width, height: this._height };
    };
    
    StreamLegend.prototype.width = function (val) {
        if (!arguments.length) { return this._width; }
        
        this._width  = val;
        this.flush();
        return this;
    };
    
    StreamLegend.prototype.itemSpan = function (val) {
        if (!arguments.length) { return this._itemSpan; }
        
        this._itemSpan  = val;
        this.flush();
        return this;
    };
    
    StreamLegend.prototype.getNodes = function () {
        if (this._nodes.length > 0) { return this._nodes; }

        var textBox, titleBox,
            symSize = sqrt(this._symbolSize);

        textBox = getTBox(this._data.map(this._dataAcc), this._fontStyle);
        if (!this._title) {
            titleBox = { text: "", width: 0, heigth: 0 };
        } else {
            titleBox = getTBox(this._title, this._fontStyle);
        }

        // rowHeight
        this._rowHeight = Math.max(textBox[0].height, symSize);

        // implement new properties
        this._nodes = this._data.map(function (d, i) {
            var tWidth  = textBox[i].width;

            return {
                text  : textBox[i].text,
                width : tWidth + symSize + this._symRight,
                height: this._rowHeight,
                x     : 0,
                y     : 0,
                value : d
            };
        }, this);

        var x = 0, y = 0;
        this._nodes.forEach(function (d) {
            if ((d.width + x) < this._width) {
                d.x = x;
                d.y = y;
                x   = d.width + x + this._itemSpan;
            } else {
                this._row += 1;
                x   = 0;
                y   = (this._rowHeight + this._rowSpan) * (this._row - 1);
                d.x = x;
                d.y = y;
                x   = d.width + x + this._itemSpan;
            }
        }, this);

        return this._nodes;
    };

    // reasign flush function
    StreamLegend.prototype.flush = function () {
        this._height = null;
        this._nodes = [];
    };

    function streamDraw (ss) {
        if (!this._data.length) { return; }

        var sym = d3.svg.symbol();
        var ts = this, tt = 0;

        ss.style(this._fontStyle);
        if (this._title.length > 0) {
            tt = this._textHeight + this._rowSpan;
            ss.append("text")
                .text(this._title)
                .attr("transform", "translate(0," + this._textHeight + ")");
        }

        ss.selectAll("g")
          .data(this.getNodes())
          .enter()
          .append("g")
          .each(function (dd, ii) {
             var self = d3.select(this);
             sym.type(typeof ts._symbol === "string" ? ts._symbol : ts._symbol(dd.value, ii))
                .size(ts._symbolSize);

             self.attr("transform",
                    "translate(" + [dd.x, dd.y + tt + ts._rowSpan] + ")");
             self.append("path").attr({
                 fill      : typeof ts._color === "string" ? ts._color : ts._color(dd.value, ii),
                 transform : "translate(" + (sqrt(ts._symbolSize) * 0.5) + ",0)",
                 d         : sym()
             });

             self.append("text")
                 .text(dd.text)
                 .attr("transform", "translate(" +
                       [sqrt(ts._symbolSize) + ts._symRight, sqrt(ts._symbolSize) * 0.5] +
                       ")");
          });
    }

    function bindThis (type) {
        var obj;
        if (type == "VerticalLegend") {
            obj = new VerticalLegend();
            obj.draw = verticalDraw.bind(obj);
        } else if (type == "StreamLegend") {
            obj = new StreamLegend();
            obj.draw = streamDraw.bind(obj);
        }
        
        return obj;
    }
    
    d3.util = {
        extend:  extend,
        getTBox: getTBox,
        inherit: inherit,
        vLegend: function () { return bindThis("VerticalLegend"); },
        sLegend: function () { return bindThis("StreamLegend"); }
    };

}) (typeof d3 == "undefined" ? null : d3, document);


