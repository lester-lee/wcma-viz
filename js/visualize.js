---
---
/* Load json files */
let node_data = $.getJSON("{{site.baseurl}}/json/wcma-collection--color.json");
let exhibit_nodes = $.getJSON("{{site.baseurl}}/json/exhibit_nodes.json");
let exhibit_data = $.getJSON("{{site.baseurl}}/json/exhibitions--refactored.json");
let graph_data = $.getJSON("{{site.baseurl}}/json/collection_graph.json");

$.when(node_data, exhibit_data, exhibit_nodes, graph_data).then(function (vnode, vex, vexn, vg) {
  console.log("Data loaded.");
  node_data = vnode[0];
  exhibit_data = vex[0];
  exhibit_nodes = vexn[0];
  graph_data = vg[0];
  setup_d3();
  init_graph();
  visualize();
});


// Visualization D3 variables
const width = window.innerWidth;
const height = window.innerHeight;
let simulation;
let main_svg;
let radius = 10;

// Keep track of visible nodes and links
let nodes, links;
let saved_node, saved_svg;
let is_locked = false;

function setup_d3() {
  main_svg = d3.select('.Collection')
    .attr('width', width)
    .attr('height', height);

  let linkForce = d3.forceLink()
    .id(function (link) {
      return link.id;
    })
    .distance(100);

  simulation = d3.forceSimulation()
    .force('link', linkForce)
    .force('charge', d3.forceManyBody().strength(-15))
    .force('center', d3.forceCenter(width / 2, height / 2));

}

function init_graph() {
  // Randomly sample exhibit nodes
  let initial_nodes = _.sample(exhibit_nodes, 10);
  let initial_node_ids = _.map(initial_nodes, function (n) {
    return n.id;
  });

  let connected_node_ids = [];

  // find all nodes connected to exhibit nodes
  let initial_links = _.filter(graph_data.links, function (l) {
    if (_.contains(initial_node_ids, l.source)) {
      connected_node_ids.push(l.target);
      return true;
    } else if (_.contains(initial_node_ids, l.target)) {
      connected_node_ids.push(l.source);
      return true;
    }
    return false;
  });

  let connected_nodes = _.filter(graph_data.nodes, function (n) {
    return _.contains(connected_node_ids, n.id);
  });

  nodes = _.union(initial_nodes, connected_nodes);
  links = initial_links;
}

function visualize() {

  main_svg.append('rect')
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

  let linkElements = main_svg.append('g')
    .selectAll('line')
    .data(links)
    .enter().append('line')
    .attr('stroke-width', 1)
    .attr('stroke', '#bbb');


  let nodeElements = main_svg.append('g')
    .selectAll('circle')
    .data(nodes)
    .enter().append('circle')
    .attr('r', radius)
    .attr('fill', getNodeColors(0))
    .attr('stroke', getNodeColors(1))
    .attr('stroke-width', radius / 2)
    .on('mouseover', handleMouseOver)
    .on('mouseout', handleMouseOut)
    .on('click', handleClick);


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

  let drag_drop = d3.drag()
    .on('start', node => {
      node.fx = node.x;
      node.fy = node.y;
    })
    .on('drag', node => {
      simulation.alphaTarget(0.7).restart();
      node.fx = d3.event.x;
      node.fy = d3.event.y;
    })
    .on('end', node => {
      if (!d3.event.active) {
        simulation.alphaTarget(0);
      }
      node.fx = null;
      node.fy = null;
    });

  nodeElements.call(drag_drop);

};

function handleMouseOver(d, i) {
  d3.select(this).attr('r', radius * 2);
  updateCard(d);
}

function handleMouseOut(d, i) {
  d3.select(this).attr('r', radius);
  if (is_locked) {
    updateCard(saved_node);
    saved_svg.attr('r', radius * 2);
  } else {
    $('.Card').removeClass('--active');
  }
}

function handleClick(d, i) {
  is_locked = true;
  if (saved_svg) {
    saved_svg.attr('r', radius);
  }
  saved_node = d;
  saved_svg = d3.select(this);
  updateCard(saved_node);
}
