# d3-util
A collection of utilities based on `d3.v3.x` for drawing legend.


## Features:
- familiar syntax with d3 and simple to use
- [d3.util.vLegend](#util_vlegend) can tell you how much space should be spared before legend drawing
- [d3.util.sLegend](#util_slegend) will give a stream-like legend layout
- other useful utilities


## Install
```html
<head>
    <meta charset="UTF-8">
    <script src="source/d3-v3.5.17.min.js"></script>
    <script src="d3-util.js"></script>
</head>
```


## API

### <a name="util_extend" href="#util_extend">#</a> d3.util.<b>extend</b> (*target*, *source*)
Shallow copy properties from *source* object to *target* object. This function performes like [d3.rebind](https://github.com/d3/d3-3.x-api-reference/blob/master/Internals.md#rebind).

### <a name="util_gettbox" href="#util_gettbox">#</a> d3.util.<b>getTBox</b> (*texts*, *[style]*)
Return how much space a text or texts can ocupied at the specified *style*. 
- If *texts* is a string this function will return an object like this:
  ```javascript
    { text: "text content", width: 15.24, height: 5.36 }
  ```
- If *texts* is an array containing texts it will return an array of objects represented each dimmension:
  ```javascript
    [{ text: "text content", width: 15.24, height: 5.36 }, ... ]
  ```
- *style* is optional, the default value is: 
  ```javascript
    {"font": "12px arial, sans-serif"}
  ```
  
### <a name="util_vlegend" href="#util_vlegend">#</a> d3.util.<b>vLegend</b> ()
![vertical legend](https://raw.githubusercontent.com/1cr18ni9/d3-util/master/vertical-legend.png)

Constructs a new vertical layout legend.

Following basic methods are shared with stream legend, which will return the legend instance itself if *val* is specified:
#### legend.fontStyle(*[val]*)
If *val* is specified, set the font style of legend to *val*. The defualt value is:
```javascript
{"font": "12px arial, sans-serif"}
```
If *val* is not specified, return the default value.


#### legend.rowSpan(*[val]*)
If *val* is specified, set the row span to *val*. The defualt row span is: *5*.


#### legend.title(*[val]*)
Specify the legend title. If *val* is empty string or not specified, return the default one which is "". If title is empty the legend will not spare space for it and legend.size will ignore it.


#### legend.symbol(*[val]*)
*val* could be a symbol string or accessor function. If this value is not specified return the default one: "circle". More detail information please referance to [d3.svg.symbol](https://github.com/d3/d3-3.x-api-reference/blob/master/SVG-Shapes.md#symbol).


#### legend.symbolSize(*[val]*)
Specify the symbol size or just return the default value: *64*. More detail information please referance to [symbol.size](https://github.com/d3/d3-3.x-api-reference/blob/master/SVG-Shapes.md#symbol_size).


#### legend.symRight(*[val]*)
Specify the padding between symbol and the right side text. If *val* is not given return the default value: *5*.


#### legend.color(*[val]*)
*val* could be a color string or accessor function. If this value is not specified return the default one: "blue".


#### legend.data(*[array], [accessor]*)
The *array* data will be joined to each legend item. the *accessor* function behave like the map function specifing the item text.
The default *accessor* function is:
```javascript
  function (d) { return d; }
```
If no arguments is specified return *null*.


#### legend.flush()
Return the legend itself and erase the dimmension witch **legend.size**() will return. Normally, this plug will flush dimmension automatically when setting *rowSpan*, *fontStyle*, *title*, *symbolSize*, *symRight* and *data*.



Following method are only applied to vertical legend:
#### legend.size()
Return the dimmension of the legend, like this: *{ width: 123.5, height: 75.3 }*. If the dimmension is pre-calculated this method will return the catched one.
The benefit of this method is that peopel can figure out how much space the legend can be accommodated.

#### legend.draw(selection)
After configuration of this legend, just simply revoke like this: *selection.call(legend.draw)*.



### <a name="util_slegend" href="#util_slegend">#</a> d3.util.<b>sLegend</b> ()
![stream legend](https://raw.githubusercontent.com/1cr18ni9/d3-util/master/stream-legend.png)

#### legend.size()
Return the dimmension of the legend, like this: *{ width: 123.5, height: 75.3 }*. If the dimmension is pre-calculated this function will return the catched.


#### legend.width(*[val]*)
Specify legend with. If not specified ruturn the default value: *150*. **Note**: if the longest item is longer than width, this plug will not extend legend width.


#### legend.itemSpan(*[val]*)
Specify adjacent items horizontal distance. If not specified return the default value: *5*.


#### legend.getNodes(*[val]*)
Return an array of items information: 
```javascript
[
  {
      text  : "text content",
      width : 178.55, // item width(symbol width + symRight + text width)
      height: 78.5,   // item height(the greater one in text height and symbol height)
      x     : 0,      // item x coordinate
      y     : 0,      // item y coordinate
      value : d       // original value
  },
  /* ... */
]
```

#### legend.flush()
Overwrite the base prototype. This methord will flush legend height and legend nodes.


#### legend.draw(*[val]*)
After configuration of this legend, just simply revoked like this: *selection.call(legend.draw)*.



