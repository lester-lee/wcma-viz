---
---
/* Load json files */
let node_data = $.getJSON("{{site.baseurl}}/json/wcma-collection--color.json");
let exhibit_data = $.getJSON("{{site.baseurl}}/json/exhibitions--refactored.json");
let graph_data = $.getJSON("{{site.baseurl}}/json/collection_graph.json");

$.when(node_data, exhibit_data, graph_data).then(function (vnode, vex, vg) {
  console.log("Data loaded.");
  node_data = vnode[0];
  exhibit_data = vex[0];
  graph_data = vg[0];
  visualize();
});

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
      .scaleExtent([1 / 2, 4])
      .on('zoom', zoomed));

  function zoomed() {
    nodeElements.attr('transform', d3.event.transform);
    linkElements.attr('transform', d3.event.transform);
  }

  /* Setup simulation */
  let linkForce = d3.forceLink()
    .id(function (link) {
      return link.id;
    })
    .distance(50);

  let simulation = d3.forceSimulation()
    .force('link', linkForce)
    .force('charge', d3.forceManyBody().strength(-25))
    .force('center', d3.forceCenter(width / 2, height / 2));

  let nodes = _.sample(graph_data.nodes, 300);
  let node_ids = _.map(nodes, function (n) {
    return n.id;
  })
  let links = _.filter(graph_data.links, function (l) {
    return _.contains(node_ids, l.source) &&
      _.contains(node_ids, l.target);
  });

  console.log(links);
  console.log(node_ids);


  let linkElements = svg.append('g')
    .selectAll('line')
    .data(links)
    .enter().append('line')
    .attr('stroke-width', 1)
    .attr('stroke', '#bbb');


  let nodeElements = svg.append('g')
    .selectAll('circle')
    .data(nodes)
    .enter().append('circle')
    .attr('r', 10)
    .attr('fill', getNodeColors(0))
    .attr('stroke', getNodeColors(1))
    .attr('stroke-width', 5);


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

  simulation.force('link').links(links);

};