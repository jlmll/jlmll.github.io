class PCAplot{
  constructor(container,widgetID,screenX,screenY,totalWidth,totalHeight) {
    //
    this.renderingArea = {x:screenX,y:screenY,
      width:totalWidth,height:totalHeight};
    this.margins = {left:5,right:5,top:5,bottom:5};
    this.canvasWidth = this.renderingArea.width - this.margins.left - this.margins.right;
    this.canvasHeight = this.renderingArea.height - this.margins.top - this.margins.bottom;
    this.widgetID = widgetID;

    //
    this.data = [];

    //
    this.canvas = container
      .append("g")
      .attr("id","plot_" + widgetID)
      .attr("transform","translate("+
        (this.renderingArea.x+this.margins.left) + ", " + (this.renderingArea.y+this.margins.top) + ")");

    //
    this.xScale = d3.scaleLinear()
      .domain([-1,1])
      .range([10,this.canvasWidth]);
    this.xAxis  = d3.axisBottom(this.xScale);
    this.canvas
      .append("g")
      .attr("class","xAxis")
      .attr("transform","translate(-5," + this.canvasHeight/2  + ")");

    //
    this.yScale = d3.scaleLinear()
      .domain([-1,1])
      .range([this.canvasHeight,0]);
    this.yAxis  = d3.axisLeft(this.yScale);
    this.canvas
      .append("g")
      .attr("class","yAxis")
      .attr("transform", "translate(" + this.canvasWidth/2 + ", 0)");

    //
    var plot = this;
    var brushGroup = this.canvas.append("g").attr("class","brush");
    this.brush = d3.brush()
      .on("start",function(){
        plot.canvas.selectAll("circle").attr("fill","blue");
      })
      .on("brush",function(){
        var selectedPoints = [];
        var selection = d3.event.selection;
        plot.canvas.selectAll("circle")
          .attr("fill",function(d,i){
            var x = plot.xScale(d[0]);
            var y = plot.yScale(d[1]);
            if(selection[0][0]<=x && x<=selection[1][0] &&
              selection[0][1] <= y && y <= selection[1][1]){
              selectedPoints.push(i);
              return "white";
            }
            else
              return "yellow";
          });
        //
        if(plot.selectionCallback)
          plot.selectionCallback(selectedPoints);
      });
    brushGroup.call(this.brush);


    //
    this.updatePlot();}

  setSelectionCallback(f){
    this.selectionCallback = f;
  }


  setData(newData) {
    this.data = newData;
    this.updatePlot();
  }


  updateAxis() {
    var canvasWidth = this.canvasWidth;
    var canvasHeight = this.canvasHeight;

    //text label for the x axis
    this.xAxis(this.canvas.select(".xAxis"));

    //text label for the y axis
    this.yAxis(this.canvas.select(".yAxis"));
  }

  updateDots() {
    var colors = {0:'blue',1:'yellow',2:'red',3:'green',4:'purple',5:'pink',6:'orange',7:'brown',8:'black'}
    var circles = this.canvas.selectAll("circle").data(this.data);
    circles.exit().remove();
    var plot = this;
    circles
      .enter()
      .append("circle")
      .merge(circles)
      .attr("id", d=> d[3])
      .attr("cx",d=>plot.xScale(d[0]))
      .attr("cy",d=>plot.yScale(d[1]))
      .attr("r",4)
      .attr("fill",d=>colors[d[2]])
      .attr("fill-opacity",0.8)
      .style("stroke", d=>colors[d[2]])
      .style("stroke-width", 0)
      .style("stroke-opacity", 1)
      .on("mouseover", function(){
        d3.select(this).transition().duration(100).attr("r","6").style('stroke-width', "2");})
      .on("mouseout", function(){
        d3.select(this).transition().duration(100).attr("r","4").style('stroke-width', "0");})
      .on("click", function(){
        updateBarChart(d3.select(this).attr("id"))
      });
  }

  updatePlot(){
    this.updateAxis();
    this.updateDots();
  }
}

var container = d3.select("#pca1");
var widgetID = "pca";
var screenX = 0;
var screenY = 0;
var totalWidth = 300;
var totalHeight = 300;

var vectors = []
var vectorsRaw = $.getJSON("pcaData.json", function(json) {
  console.log(json.points)
  vectors = json.points
  pcaplot.setData(vectors)
});

var pcaplot = new PCAplot(container,widgetID,screenX,screenY,totalWidth,totalHeight);
pcaplot.setData(vectors);
