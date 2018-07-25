class correlationGraph{
  constructor(){
    this.renderingArea = {x:0,y:0,
      width:800,height:600};
    this.margins = {left:5,right:100,top:5,bottom:5};
    this.width = this.renderingArea.width - this.margins.left - this.margins.right;
    this.height = this.renderingArea.height - this.margins.top - this.margins.bottom;
    this.canvas = d3.select("#correlationChart");
    this.canvas.append('g')
        .attr("transform","translate("+ (this.renderingArea.x+this.margins.left) + ", " + (this.renderingArea.y+this.margins.top) + ")");
  }
  filterBenton(string){
    if (string.includes("Benton")){
      return false
    }else{
      return true
    }
  }

 update(columnAdata, columnAname, columnBname) {
    var categoriesA = Object.keys(columnAdata[columnBname]);
    categoriesA = categoriesA.filter(this.filterBenton);
    var categoriesB = Object.keys(columnAdata[columnBname]['Abstraction']);
    var categories = [columnAname, columnBname];
    var data = [];
    var iterator = [];
    var maxValue = 0
    categoriesA.forEach(function (d) {
      categoriesB.forEach(function (p) {
        iterator = [d, p, columnAdata[columnBname][d][p]];
        if(iterator[2] > maxValue){
          maxValue = iterator[2];
        }
        data.push(iterator);
      });
    });
    console.log(data);

    this.columnA = d3.scaleBand()
      .domain(categoriesA)
      .range([this.height, 0]);
    this.yAxis = d3.axisLeft(this.columnA);
    this.canvas
      .append('g')
      .attr('class', 'yAxis')
      .attr("transform", "translate(" + 200 + ", 0)");
   this.yAxis(this.canvas.select(".yAxis"));

    this.columnB = d3.scaleBand()
      .domain(categoriesB)
      .range([this.height, 0]);
    this.columnBaxis = d3.axisRight(this.columnB);
    this.canvas
      .append('g')
      .attr('class', 'columnBaxis')
      .attr("transform", "translate("+ this.width + "," + 0  + ")");
   this.columnBaxis(this.canvas.select(".columnBaxis"));

    var lines = this.canvas.selectAll("line").data(data);
    lines.exit().remove();

    var plot = this;
    lines
      .enter()
      .append("line")
      .attr("x1", 200)
      .attr("y1", function(d){return plot.columnA(d[0])})
      .attr("x2", this.width)
      .attr('y2', function(d){return plot.columnB(d[1])})
      .style("stroke", "black")
      .style("stroke-width", 1)
      .style("stroke-opacity", function(d){return d[2];}); //change this
  }



// Returns the path for a given data point.
path(d) {
    return line(x(d[0]), y(d[1]));}

// Handles a brush event, toggling the display of foreground lines.
brush() {
    var actives = categories.filter(function(p) { return !y[p].brush.empty(); }),
      extents = actives.map(function(p) { return y[p].brush.extent(); });
    foreground.classed("fade", function(d) {
      return !actives.every(function(p, i) {
        return extents[i][0] <= d[p] && d[p] <= extents[i][1];
      });
    });
  }


}


correlationsGraph = $.getJSON('correlation.json', function(json){
  var moca = json['moca']
  var benton = json['benton']
  var hvlt = json['hvlt']

  var columnAname = 'moca';
  var columnBname = 'benton';
  var columnAdata = moca;

  correlations = new correlationGraph();
  correlations.update(columnAdata, columnAname, columnBname);
  return correlations
;});
