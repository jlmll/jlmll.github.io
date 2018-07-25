var svg = d3.select("#correlationChart"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

var color = d3.scaleOrdinal(d3.schemeCategory20);

var simulation = d3.forceSimulation()
  .force("link", d3.forceLink().id(function(d) { return d.id; }))
  .force("charge", d3.forceManyBody())
  .force("center", d3.forceCenter(width / 2, height / 2));

d3.json("graph.json", function(error, graph) {
  if (error) throw error;

  var link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
    .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

  var node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.nodes)
    .enter().append("circle")
    .attr("r", 5)
    .attr("fill", function(d) { return color(d.group); })
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));

  node.append("title")
    .text(function(d) { return d.id; });

  simulation
    .nodes(graph.nodes)
    .on("tick", ticked);

  simulation.force("link")
    .links(graph.links);

  function ticked() {
    link
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

    node
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
  }
});

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

function filterValue(min, max){
  return function(entry){
    if (entry['value'] < min){
      return false
    }else if (entry['value'] > max){
      return false
    }else{
      return true
    }
  }
};

function filterNodes(node){
  if (node['filter'] == true){
    console.log( 'hello')
    return false;
  }else{
    return true;
  }
}


function update(min, max){
  d3.json("graph.json", function(error, graph) {
    if (error) throw error;

    graph['links'] = graph['links'].filter(filterValue(min, max));

    // for (j = 0; j < graph.nodes.length; i++){
    //   var id = graph.nodes[j]['id'];
    //   graph.nodes[j]['filter'] = true;
    //   for (var i=0; i < graph.links.length; i++) {
    //     var source = graph.links[i]["source"];
    //     var target = graph.links[i]['target'];
    //     if (id == source || id == target) {
    //       graph.nodes[j]['filter'] = false;
    //     }
    //   }
    // }

    graph['nodes'] = graph['nodes'].filter(filterNodes);

    var link = svg
      .selectAll("line")
      .data(graph.links)
      .exit().remove();

    var node = svg.selectAll('circle')
      .data(graph.nodes)
      .exit().remove();

      link.append('g')
        .attr('class', 'newLinks')
        .selectAll('line')
        .data(graph.links)
        .enter().append("line")
        .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

    node = svg.append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(graph.nodes)
      .enter().append("circle")
      .attr("r", 5)
      .attr("fill", function(d) { return color(d.group); })
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    node.append("title")
      .text(function(d) { return d.id; });

    simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

    simulation.force("link")
      .links(graph.links);

    function ticked() {
      link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

      node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
    }
  });
};

$( function() {
  $( "#slider-range" ).slider({
    range: true,
    min: 0,
    max: 20,
    values: [ 0, 20 ],
    slide: function( event, ui ) {
      $( "#amount" ).val( "" + ui.values[ 0 ] + " - " + ui.values[ 1 ] );
    },
    change: function(event, ui) {
      update(ui.values[ 0 ], ui.values[ 1 ]);
    }
  });
  $( "#amount" ).val( ""+ $( "#slider-range" ).slider( "values", 0 ) +
    " - " + $( "#slider-range" ).slider( "values", 1 ) );
} );
