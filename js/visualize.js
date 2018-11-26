---
---
/* Load json files */
let node_data = $.getJSON("{{site.baseurl}}/json/wcma-collection--color.json");
let exhibit_data = $.getJSON("{{site.baseurl}}/json/exhibitions--refactored.json");
let graph_data = $.getJSON("{{site.baseurl}}/json/collection_graph.json");

$.when(node_data, exhibit_data, graph_data).then(function(vnode, vex, vg){
  console.log("Data loaded.");
  node_data = vnode[0];
  exhibit_data = vex[0];
  graph_data = vg[0];
  visualize();
});

function getNodeColors(node) {
  let default_colors = ["#408fa7", "#408fa7", "#408fa7"];
  let data = node_data[node.id];
  let colors = data.dominant_colors;
  colors = colors || default_colors;
  // console.log(data, colors);
  return colors[0];
}

function visualize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const svg = d3.select('.Collection')
    .attr('width', width)
    .attr('height', height);

  let nodes = graph_data["nodes"];

  const simulation = d3.forceSimulation()
    .force('charge', d3.forceManyBody().strength(-20))
    .force('center', d3.forceCenter(width / 2, height / 2));

  const nodeElements = svg.append('g')
    .selectAll('circle')
    .data(nodes)
    .enter().append('circle')
      .attr('r', 10)
      .attr('fill', getNodeColors);

  simulation.nodes(nodes).on('tick', () => {
    nodeElements
    .attr("cx", node => node.x)
    .attr("cy", node => node.y)
  });
};