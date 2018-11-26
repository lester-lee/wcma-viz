/* Load json files */
let node_data = $.getJSON("/json/wcma-collection--color.json");
let exhibit_data = $.getJSON("/json/exhibitions--refactored.json");
let graph_data = $.getJSON("/json/collection_graph.json");

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

  svg.append('rect')
    .attr('width', width)
    .attr('height', height)
    .style('fill', 'none')
    .style('pointer-events', 'all')
    .call(d3.zoom()
      .scaleExtent([1/2, 4])
      .on('zoom', zoomed));

  function zoomed(){
    nodeElements.attr('transform', d3.event.transform);
    linkElements.attr('transform', d3.event.transform);
  }

  /* Show nodes */
  let nodes = graph_data.nodes;

  const simulation = d3.forceSimulation()
    .force('charge', d3.forceManyBody().strength(-5))
    .force('center', d3.forceCenter(width / 2, height / 2));

  const nodeElements = svg.append('g')
    .selectAll('circle')
    .data(nodes)
    .enter().append('circle')
      .attr('r', 10)
      .attr('fill', getNodeColors);

  /* Show links 
  let links = graph_data.links;
  simulation.force('link', d3.forceLink()
    .id(link => link.id)
    .strength(link => 0.7));

  const linkElements = svg.append('g')
    .selectAll('line')
    .data(links)
    .enter().append('line')
      .attr('stroke-width', 1)
      .attr('stroke', '#bbb');
  */
  simulation.nodes(nodes).on('tick', () => {
    nodeElements
      .attr('cx', node => node.x)
      .attr('cy', node => node.y);

    linkElements
      .attr('x1', link => link.source.x)
      .attr('y1', link => link.source.y)
      .attr('x2', link => link.target.x)
      .attr('y2', link => link.target.y);
  });

  //simulation.force('link').links(links);

};