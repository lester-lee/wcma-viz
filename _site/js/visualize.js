// Load JSON files
let node_data = $.getJSON("/json/wcma-collection--color.json");
let exhibit_nodes = $.getJSON("/json/exhibit_nodes.json");
let exhibit_data = $.getJSON("/json/exhibitions--refactored.json");
let graph_data = $.getJSON("/json/collection_graph.json");

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
let drag_drop;
let radius = 10;

// Keep track of visible nodes and links
let nodes, node_ids, links, link_ids;
let nodeElements, linkElements;
let saved_node, saved_svg;
let is_locked = false;

function setup_d3() {
  main_svg = d3.select('.Collection')
    .attr('width', width)
    .attr('height', height);

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
  let linkForce = d3.forceLink()
    .id(function (link) {
      return link.id;
    })
    .distance(100);

  simulation = d3.forceSimulation()
    .force('link', linkForce)
    .force('charge', d3.forceManyBody().strength(-15))
    .force('center', d3.forceCenter(width / 2, height / 2));

  drag_drop = d3.drag()
    .on('start', node => {
      node.fx = node.x;
      node.fy = node.y;
    })
    .on('drag', node => {
      simulation.force('charge', d3.forceManyBody().strength(1));
      simulation.alphaTarget(0.95).restart();
      node.fx = d3.event.x;
      node.fy = d3.event.y;
    })
    .on('end', node => {
      if (!d3.event.active) {
        simulation.alphaTarget(0.1);
        simulation.force('charge', d3.forceManyBody().strength(-9));
      }
      node.fx = null;
      node.fy = null;
    });
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
  node_ids = _.union(initial_node_ids, connected_node_ids);
  links = initial_links;

  // Update graph to reduce search later
  // console.log(graph_data);
  graph_data.nodes = _.difference(graph_data.nodes, nodes);
  graph_data.links = _.difference(graph_data.links, links);
  // console.log(graph_data);
}

function updateGraph() {
  linkElements = main_svg.append('g').selectAll('line').data(links);
  let linkEnter = linkElements.enter()
    .append('line')
    .attr('stroke-width', 1)
    .attr('stroke', '#bbb');
  linkElements = linkEnter.merge(linkElements);

  nodeElements = main_svg.append('g').selectAll('circle').data(nodes);
  let nodeEnter = nodeElements.enter().append('circle')
    .attr('r', radius)
    .attr('fill', getNodeColors(0))
    .attr('stroke', getNodeColors(1))
    .attr('stroke-width', radius / 2)
    .call(drag_drop)
    .on('mouseover', handleMouseOver)
    .on('mouseout', handleMouseOut)
    .on('click', handleClick);
  nodeElements = nodeEnter.merge(nodeElements);
}

function visualize() {
  updateGraph();
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
  simulation.restart();
  console.log("start");
}

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

function addNeighbors() {
  let connected_node_ids = [];
  let new_links = _.filter(graph_data.links, function (l) {
    if (l.source === saved_node.id) {
      connected_node_ids.push(l.target);
      return true;
    } else if (l.target === saved_node.id) {
      connected_node_ids.push(l.target);
      return true;
    }
    return false;
  });
  let connected_nodes = _.filter(graph_data.nodes, function (n) {
    return _.contains(connected_node_ids, n.id);
  });
  console.log(nodes, links);

  nodes = _.union(connected_nodes, nodes);
  links = _.union(new_links, links);
  console.log(nodes, links);
  visualize();
}
