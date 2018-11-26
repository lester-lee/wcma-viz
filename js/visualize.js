---
---

let node_data = $.getJSON("{{site.baseurl}}/json/wcma-collection--color.json");
let exhibit_data = $.getJSON("{{site.baseurl}}/json/exhibitions--refactored.json");
let graph_data = $.getJSON("{{site.baseurl}}/json/collection_graph.json");

$.when(node_data, exhibit_data, graph_data).then(function(){
  console.log("Data loaded.");
  visualize();
});

function getNodeColors(node) {
  let data = node_data[node.id]
  let colors = data.dominant_colors;
  return colors.split("$")[0];
}

function visualize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const svg = d3.select('.Collection')
    .attr('width', width)
    .attr('height', height);

  const simulation = d3.forceSimulation()
    .force('charge', d3.forceManyBody().strength(-20))
    .force('center', d3.forceCenter(width / 2, height / 2));

  const nodeElements = svg.append('g')
    .selectAll('circle')
    .data(graph_data.nodes)
    .enter().append('circle')
    .attr('r', 10)
    .attr('fill', getNodeColors)
};