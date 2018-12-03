---
---

function updateCard(node) {
  if (node.node_type === "object") {
    let data = node_data[node._id];
    $('.CardTitle').text(data.title);
    $('.CardBy').text(data.maker);
    $('.CardMedium').text(data.medium);
    $('.CardDimensions').text(data.dimensions);
    $('.CardDescription').text(data.description);
    $('.CardLink').attr('href', 'http://egallery.williams.edu/search/' + data.title);
    updateThumbnail(node._id);
  } else if (node.node_type === "exhibit") {
    let data = exhibit_data[node._id];
    // console.log(data);
    $('.CardTitle').text(data.ExhTitle);
    $('.CardBy').text(data.BeginISODate + " to " + data.EndISODate)
    $('.CardMedium').text("")
    $('.CardDimensions').text("");
    $('.CardDescription').text(data.CurNotes);
  }
  $('.Card').addClass('--active');
}

function updateThumbnail(id) {
  if (thumbnail_urls[id] !== "None") {
    $('.CardThumbnail').attr('src', thumbnail_urls[id]);
  } else {
    $('.CardThumbnail').attr('src', "");
  }
}

$('.CardNeighbors').on('click', function () {
  addNeighbors(saved_node);
});

$('.CardExpand').on('click', function() {
  let node = _.sample(graph_data.nodes, 1)[0];
  nodes.push(node);
  addNeighbors(node);
});

$('.CardClose').on('click', function () {
  $('.Card').removeClass('--active');
  is_locked = false;
});

function chooseNodes() {
  // Randomly sample exhibit nodes
  initial_nodes = _.sample(exhibit_nodes, 5);

  // Show initial nodes to the user
  let idx = initial_nodes.length;
  while (idx--) {
    node = initial_nodes[idx];
    exh = `<li class="ExhibitChoice">
      <input type="checkbox" name="${node.id}" id="${node.id}" />
      <label for="${node.id}">${exhibit_data[node._id].ExhTitle}</label>
      </li>`;
    console.log(exh);
    $('.ExhibitChoices').append($(exh));
  }
  $('.ModalLoading').hide();
  $('.ModalContent').append($('<button>',
  {
    class: 'ExhibitSubmit',
    text: 'Submit'
  }));
}

$('.SplashModal').on('click', '.ExhibitSubmit', function(){
  // Retrieve selected nodes
  let selected = [];
  $('.ExhibitChoices input:checked').each(function(){
    selected.push($(this).attr('name'));
  });

  // If node selected, update variables and start viz
  if (selected.length){
    initial_nodes = _.filter(initial_nodes, function(n){
      return _.contains(selected, n.id);
    });
    initial_node_ids = _.map(initial_nodes, function(n) {
      return n.id;
    })
    init_graph();
    $('.SplashModal').hide();
  }else{
    alert("Please choose at least one exhibit.");
  }
});