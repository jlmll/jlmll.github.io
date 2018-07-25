function start(){var patients = []
  var data = $.getJSON("patients.json", function(json) {
    patients = json.patients
    var predata = patients[1].volumeControl
    var names = Object.keys(predata)
    var controlNumbers = Object.values(predata)
    var datasetA = []
    var datasetB = []
    predata = patients[1].volumeTotal
    var totalNumbers = Object.values(predata)
    for (i = 0; i<names.length; i++){
      if (controlNumbers[i] > totalNumbers[i]){
        datasetA.push({'field':names[i], 'value':controlNumbers[i], 'color':'steelblue'})
        datasetB.push({'field':names[i], 'value':totalNumbers[i], 'color':'orange'})
      }else{
        datasetB.push({'field':names[i], 'value':controlNumbers[i], 'color':'steelblue'})
        datasetA.push({'field':names[i], 'value':totalNumbers[i], 'color':'orange'})
      }
    }


    var svg = d3.select("#barChart"),
      margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom;

    var x = d3.scaleBand().rangeRound([0, width]).padding(0.1).domain(names),
      y = d3.scaleLinear().rangeRound([height, 0]).domain([0, d3.max(totalNumbers)]);


    var groupA = d3.select('#barChart').append('g').attr("transform","translate(" + margin.left + "," + margin.top + ")");
    var groupB = d3.select('#barChart').append('g').attr("transform","translate(" + margin.left + "," + margin.top + ")");

    groupA.selectAll('.bar')
      .data(datasetA)
      .enter().append('rect')
      .attr('id', d=> d.field)
      .attr('class', 'bar')
      .attr('x', d=> x(d.field))
      .attr('y', d=> y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', function(d) {
        return height - y(d.value);
      })
      .attr('fill', function(d){
        return d.color
      })
      .attr('opacity', 0.5)
      .on('mouseover', function(d){
        d3.select('#text_' + d.field)
          .transition()
          .duration(100)
          .attr("opacity", 1)
          .attr("x", d3.select(this).attr('x'));
      }).on('mouseout', function(d){
      d3.select('#text_'+d.field)
        .transition()
        .duration(100)
        .attr("opacity", 0);
    });

    groupB.selectAll('.bar')
      .data(datasetB)
      .enter().append('rect')
      .attr('id', d=> d.field)
      .attr('class', 'bar')
      .attr('x', d=> x(d.field))
      .attr('y', d=> y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', function(d) {
        return height - y(d.value);
      })
      .attr('fill', function(d){
        return d.color
      })
      .attr('opacity', 0.5)
      .on('mouseover', function(d){
        d3.select('#text_' + d.field)
          .transition()
          .duration(100)
          .attr("opacity", 1)
          .attr("x", d3.select(this).attr('x'));
      }).on('mouseout', function(d){
      d3.select('#text_'+d.field)
        .transition()
        .duration(100)
        .attr("opacity", 0);
    });


    var textGroup = d3.select('canvas').append('g').attr("transform","translate(40,510)");

    var textUp = textGroup.selectAll('text')
      .data(datasetA)
      .enter()
      .append('text');

    var downLabels = textUp
      .attr('id', d=> "text_" + d.field)
      .attr('x', function(d){
        return d3.select("#"+d.field).attr('x')})
      .attr('y', function(d){return 10})
      .text(function(d){return d.field})
      .attr("text-anchor", "middle")
      .attr("font-family", "verdana")
      .attr("font-size", "12")
      .attr("font-weight", "bold")
      .attr("fill", "purple")
      .attr("opacity", "0");

    d3.select('#sortingCheckbox').on("change", change);
    function change() {

      // Copy-on-write since tweens are evaluated after a delay.
      var x0 = x.domain(datasetB.sort(this.checked
        ? function(a, b) { return b.value - a.value; }
        : function(a, b) { return d3.ascending(a.field, b.field); })
        .map(function(d) { return d.field; }))
        .copy();

      groupA.selectAll(".bar")
        .sort(function(a, b) { return x0(a.field) - x0(b.field); });

      var transition = svg.transition().duration(750),
        delay = function(d, i) { return i * 5; };

      transition.selectAll(".bar")
        .delay(delay)
        .attr("x", function(d) { return x0(d.field); });

      transition.selectAll("text")
        .selectAll("g")
        .delay(delay);

      groupB.selectAll(".bar")
        .sort(function(a, b) { return x0(a.field) - x0(b.field); });

      var transition = svg.transition().duration(750),
        delay = function(d, i) { return i * 5; };

      transition.selectAll(".bar")
        .delay(delay)
        .attr("x", function(d) { return x0(d.field); });

      transition.selectAll("text")
        .selectAll("g")
        .delay(delay);
    }
  });
}

function updateBarChart(patientId){
  var oldChart = d3.select('#barChart').selectAll('g').remove();
  document.getElementById("patientTitle").textContent="Patient "+patientId

  var patients = []
  var data = $.getJSON("patients.json", function(json) {
    patients = json.patients
    var index = 0
    for (var i=0 ; i < patients.length ; i++) {
      if (patients[i]["patientID"] == patientId) {
        index = i;
      }
    }
    var predata = patients[index].volumeControl
    var names = Object.keys(predata)
    var controlNumbers = Object.values(predata)
    var datasetA = []
    var datasetB = []
    predata = patients[index].volumeTotal
    var totalNumbers = Object.values(predata)
    for (i = 0; i<names.length; i++){
      if (controlNumbers[i] > totalNumbers[i]){
        datasetA.push({'field':names[i], 'value':controlNumbers[i], 'color':'steelblue'})
        datasetB.push({'field':names[i], 'value':totalNumbers[i], 'color':'orange'})
      }else{
        datasetB.push({'field':names[i], 'value':controlNumbers[i], 'color':'steelblue'})
        datasetA.push({'field':names[i], 'value':totalNumbers[i], 'color':'orange'})
      }
    }


    var svg = d3.select("#barChart"),
      margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom;

    var x = d3.scaleBand().rangeRound([0, width]).padding(0.1).domain(names),
      y = d3.scaleLinear().rangeRound([height, 0]).domain([0, d3.max(totalNumbers)]);


    var groupA = d3.select('#barChart').append('g').attr("transform","translate(" + margin.left + "," + margin.top + ")");
    var groupB = d3.select('#barChart').append('g').attr("transform","translate(" + margin.left + "," + margin.top + ")");

    groupA.selectAll('.bar')
      .data(datasetA)
      .enter().append('rect')
      .attr('id', d=> d.field)
      .attr('class', 'bar')
      .attr('x', d=> x(d.field))
      .attr('y', d=> y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', function(d) {
        return height - y(d.value);
      })
      .attr('fill', function(d){
        return d.color
      })
      .attr('opacity', 0.5)
      .on('mouseover', function(d){
        d3.select('#text_' + d.field)
          .transition()
          .duration(100)
          .attr("opacity", 1)
          .attr("x", d3.select(this).attr('x'));
      }).on('mouseout', function(d){
      d3.select('#text_'+d.field)
        .transition()
        .duration(100)
        .attr("opacity", 0);
    });

    groupB.selectAll('.bar')
      .data(datasetB)
      .enter().append('rect')
      .attr('id', d=> d.field)
      .attr('class', 'bar')
      .attr('x', d=> x(d.field))
      .attr('y', d=> y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', function(d) {
        return height - y(d.value);
      })
      .attr('fill', function(d){
        return d.color
      })
      .attr('opacity', 0.5)
      .on('mouseover', function(d){
        d3.select('#text_' + d.field)
          .transition()
          .duration(100)
          .attr("opacity", 1)
          .attr("x", d3.select(this).attr('x'));
      }).on('mouseout', function(d){
      d3.select('#text_'+d.field)
        .transition()
        .duration(100)
        .attr("opacity", 0);
    });


    var textGroup = d3.select('#barChart').append('g').attr("transform","translate(40,510)");

    var textUp = textGroup.selectAll('text')
      .data(datasetA)
      .enter()
      .append('text');

    var downLabels = textUp
      .attr('id', d=> "text_" + d.field)
      .attr('x', function(d){
        return d3.select("#"+d.field).attr('x')})
      .attr('y', function(d){return 10})
      .text(function(d){return d.field})
      .attr("text-anchor", "middle")
      .attr("font-family", "verdana")
      .attr("font-size", "12")
      .attr("font-weight", "bold")
      .attr("fill", "purple")
      .attr("opacity", "0");

    d3.select('#sortingCheckbox').on("change", change);



    function change() {


      // Copy-on-write since tweens are evaluated after a delay.
      var x0 = x.domain(datasetB.sort(this.checked
        ? function(a, b) { return b.value - a.value; }
        : function(a, b) { return d3.ascending(a.field, b.field); })
        .map(function(d) { return d.field; }))
        .copy();

      groupA.selectAll(".bar")
        .sort(function(a, b) { return x0(a.field) - x0(b.field); });

      var transition = svg.transition().duration(750),
        delay = function(d, i) { return i * 5; };

      transition.selectAll(".bar")
        .delay(delay)
        .attr("x", function(d) { return x0(d.field); });

      transition.selectAll("text")
        .selectAll("g")
        .delay(delay);

      groupB.selectAll(".bar")
        .sort(function(a, b) { return x0(a.field) - x0(b.field); });

      var transition = svg.transition().duration(750),
        delay = function(d, i) { return i * 5; };

      transition.selectAll(".bar")
        .delay(delay)
        .attr("x", function(d) { return x0(d.field); });

      transition.selectAll("text")
        .selectAll("g")
        .delay(delay);
    }
  });
}

this.start()
