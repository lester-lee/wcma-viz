---
---

// Load JSON files
let node_data = $.getJSON("{{site.baseurl}}/json/wcma-collection--color.json");
let exhibit_nodes = $.getJSON("{{site.baseurl}}/json/exhibit_nodes.json");
let exhibit_data = $.getJSON("{{site.baseurl}}/json/exhibitions--refactored.json");
let graph_data = $.getJSON("{{site.baseurl}}/json/collection_graph.json");
let thumbnail_urls = $.getJSON("{{site.baseurl}}/json/thumbnail_urls.json");

$.when(node_data, exhibit_data, exhibit_nodes, graph_data, thumbnail_urls).then(function (vnode, vex, vexn, vg, tmb) {
  console.log("Data loaded.");
  node_data = vnode[0];
  exhibit_data = vex[0];
  exhibit_nodes = vexn[0];
  graph_data = vg[0];
  thumbnail_urls = tmb[0];
  setup_d3();
  chooseNodes();
});


// Visualization D3 variables
const width = window.innerWidth;
const height = window.innerHeight;
let simulation;
let main_svg;
let drag_drop;
let radius = 10;
let color_mode;

// Keep track of visible nodes and links
let initial_nodes, initial_node_ids;
let nodes, node_ids, links, link_ids;
let nodeGroup, linkGroup;
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

  linkGroup = main_svg.append('g').attr("class", "Links");
  nodeGroup = main_svg.append('g').attr("class", "Nodes");

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
    .force('charge', d3.forceManyBody().strength(-15).distanceMax(270))
    .force('center', d3.forceCenter(width / 2, height / 2));

  drag_drop = d3.drag()
    .on('start', node => {
      if (!d3.event.active && !color_mode) {
        simulation.alphaTarget(0.3).restart();
      }
      node.fx = node.x;
      node.fy = node.y;
    })
    .on('drag', node => {
      node.fx = d3.event.x;
      node.fy = d3.event.y;
    })
    .on('end', node => {
      if (!d3.event.active && !color_mode) {
        simulation.alphaTarget(0);
      }
      node.fx = null;
      node.fy = null;
    });
}

function init_graph() {
  console.log(initial_nodes);
  console.log(initial_node_ids);

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

  console.log(nodes, links);

  // Update graph to reduce search later
  // console.log(graph_data);
  graph_data.nodes = _.difference(graph_data.nodes, nodes);
  graph_data.links = _.difference(graph_data.links, links);
  // console.log(graph_data);

  updateGraph();
  visualize();
}

function updateGraph() {
  linkElements = linkGroup.selectAll('line')
    .data(links, function (l) {
      return l.target + l.source;
    });
  linkElements.exit().remove();

  let linkEnter = linkElements.enter().append('line')
    .attr('stroke-width', 1)
    .attr('stroke', '#bbb');

  linkElements = linkEnter.merge(linkElements);

  nodeElements = nodeGroup.selectAll('circle')
    .data(nodes, function (n) { return n.id; });
  nodeElements.exit().remove();

  let nodeEnter = nodeElements.enter().append('circle')
    .attr('r', radius)
    .attr('fill', getNodeColor(0))
    .attr('stroke', getNodeColor(1))
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
  simulation.alphaTarget(0.3).restart();
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
  console.log(d);
  console.log(node_data[d._id]);
  if (saved_node === d) {
    saved_node = null;
    saved_svg = null;
    is_locked = false;
  } else {
    is_locked = true;
    if (saved_svg) {
      saved_svg.attr('r', radius);
    }
    saved_node = d;
    saved_svg = d3.select(this);
    updateCard(saved_node);
  }
}

function addNeighbors(node) {
  color_mode = false;
  $('.Links').show();
  let connected_node_ids = [];
  let new_links = _.filter(graph_data.links, function (l) {
    if (l.source === node.id) {
      connected_node_ids.push(l.target);
      return true;
    } else if (l.target === node.id) {
      connected_node_ids.push(l.source);
      return true;
    }
    return false;
  });
  let connected_nodes = _.filter(graph_data.nodes, function (n) {
    return _.contains(connected_node_ids, n.id) &&
      !_.contains(node_ids, n.id);
  });
  console.log("connected nodes", connected_nodes);
  console.log("new_links", new_links);

  if (connected_nodes.length > 0) {
    console.log(nodes, links);
    nodes = _.union(connected_nodes, nodes);
    links = _.union(new_links, links);
    console.log(nodes, links);
    visualize();
  }
}
