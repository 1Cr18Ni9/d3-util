# d3-util
这是一个基于`d3.v3.x`制作图例的插件。


## 特性：
- 语法与d3相似且易于使用
- [d3.util.vLegend](#util_vlegend) 垂向图例可以在配置后得知图例整体尺寸
- [d3.util.sLegend](#util_slegend) 图例流（根据指定宽度自动调整，自适应吧）
- 其他功能

## API接口

### <a name="util_extend" href="#util_extend">#</a> d3.util.<b>extend</b> (*target*, *source*)
浅复制*source*的特性到*target*。该函数与[d3.rebind](https://github.com/d3/d3-3.x-api-reference/blob/master/Internals.md#rebind)类似.

### <a name="util_gettbox" href="#util_gettbox">#</a> d3.util.<b>getTBox</b> (*texts*, *[style]*)
Return how much space a text or texts can ocupied at the specified *style*. 
返回单个字符串或一组字符串在指定样式*style*的情形下的尺寸值。
- 如果 *texts* 是一个字符串将返回一个尺寸对象：
  ```javascript
    { text: "text content", width: 15.24, height: 5.36 }
  ```
- 如果 *texts* 是一个包含多个字符串的数组将返回一个包含多个尺寸的数组:
  ```javascript
    [{ text: "text content", width: 15.24, height: 5.36 }, ... ]
  ```
- *style*为可选值，默认值如下：
  ```javascript
    {"font": "12px arial, sans-serif"}
  ```
  
### <a name="util_vlegend" href="#util_vlegend">#</a> d3.util.<b>vLegend</b> ()
![vertical legend](https://raw.githubusercontent.com/1cr18ni9/d3-util/master/vertical-legend.png)

构建一个新的垂向布置的图例。

下面是一些基础的函数，这些函数均适用于垂向图例和图例流，且函数返回图例对象自身如果*val*有指定值：

#### legend.fontStyle(*[val]*)
If *val* is specified, set the font style of legend to *val*. The defualt value is:
如果*val*有值，将字体样式设置成*val*. 字体默认样式为:
```javascript
{"font": "12px arial, sans-serif"}
```
如果 *val* 为空返回默认值。


#### legend.rowSpan(*[val]*)
指定排间距，若无指定返回默认值：*5*。


#### legend.title(*[val]*)
指定图例标题，若无指定返回默认空字符串： ""。如果图例标题为空即认为不需要设置图例标题，绘制图形时不考虑。图形尺寸亦不考虑。


#### legend.symbol(*[val]*)
*val*参数可以是字符串，也可以是一个函数（该函数必须返回一个字符串）。若未指定返回默认值："circle"。 详情请参考 [d3.svg.symbol](https://github.com/d3/d3-3.x-api-reference/blob/master/SVG-Shapes.md#symbol)。


#### legend.symbolSize(*[val]*)
指定符号大小，若未指定返回默认值为：*64*。详情请参考 [symbol.size](https://github.com/d3/d3-3.x-api-reference/blob/master/SVG-Shapes.md#symbol_size)。


#### legend.symRight(*[val]*)
指定符号与右侧文字的间距，若未指定返回默认值： *5*。


#### legend.color(*[val]*)
*val*可以是字符串或者函数（函数应返回颜色字符串），若未指定返回默认值："blue"。


#### legend.data(*[array], [accessor]*)
*array*是一个数组用于绑定数据，*accessor*函数为可选参数，用于获取*array*中的字符串。

*accessor*函数默认值为：
```javascript
  function (d) { return d; }
```
如果参数为空，返回*null*。


#### legend.flush()
返回图例本身，并且销毁原有图例尺寸。通常来说，插件会自动运行这个函数在其他参数有调整的时候， 如： *rowSpan*、 *fontStyle*、 *title*、 *symbolSize*、 *symRight* 和 *data*。


下面的这些函数仅适用于垂向图例：
#### legend.size()
返回图例尺寸，如：*{ width: 123.5, height: 75.3 }* 。 如果图例尺寸有过计算，该函数将返回之前的值。这个函数的优点是图例对象配置完后就能知道图例的总体尺寸，非常易于布局。


#### legend.draw(selection)
图例配置完后就可以直接使用绘图： *selection.call(legend.draw)* 。



### <a name="util_slegend" href="#util_slegend">#</a> d3.util.<b>sLegend</b> ()
![stream legend](https://raw.githubusercontent.com/1cr18ni9/d3-util/master/stream-legend.png)

#### legend.size()
返回图例尺寸，其中图形宽度有默认值，高度需要配置数据后计算得出。如： *{ width: 123.5, height: 75.3 }* 。



#### legend.width(*[val]*)
指定图形宽度，若未指定返回默认值： *150* 。**注意**： 如果最长的一组图例超过了这个值，插件不会自动延伸其长度。


#### legend.itemSpan(*[val]*)
指定相邻图例的间距，若为指定返回默认值：*5*　。


#### legend.getNodes(*[val]*)
返回一个数组，数组内包含绘图的尺寸要素。
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
重置了继承过来的flush函数。这个函数将重置图例高度和绘图节点。


#### legend.draw(*[val]*)
图例配置完后就可以直接使用绘图： *selection.call(legend.draw)* 。



