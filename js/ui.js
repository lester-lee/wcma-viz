---
---

function updateCard(node) {
  if (node.node_type === "object") {
    let data = node_data[node._id];

    $('.CardTitle').text(data.title);

    let byline = `${data.maker}, ${data.creation_date}`;
    $('.CardBy').text(byline);

    $('.CardMedium').text(data.medium);

    let dim_text;
    if (data.depth_in !== "0"){
      dim_text = `${data.height_in} x ${data.width_in} in. x ${data.depth_in} (${data.height_cm} x ${data.width_cm} x ${data.depth_cm} cm)`;
    }else{
      dim_text = `${data.height_in} x ${data.width_in} in. (${data.height_cm} x ${data.width_cm} cm)`;
    }
    $('.CardDimensions').text(dim_text);

    let desc = data.description;
    if (desc === "NULL"){
      desc = "Description not available."
    }
    $('.CardDescription').text(desc);

    let search_link = `http://egallery.williams.edu/search/${data.title} ${data.maker}`;
    $('.InfoLink').attr('href', search_link);
    updateThumbnail(node._id);

    let $colors = $('.ThumbnailColors');
    $colors.html('');
    let colors = data.dominant_colors || [];
    let idx = colors.length;
    while (idx--){
      $colors.append($(
        `<div class="ColorSample" style="background:${colors[idx]}"></div>`
      ));
    }

    $('.--medium').show();
    $('.--dimensions').show();
    $('.Thumbnail').show();

  } else if (node.node_type === "exhibit") {
    let data = exhibit_data[node._id];
    console.log(data);
    $('.CardTitle').text(data.ExhTitle);

    let exhDates = `${data.BeginISODate} to ${data.EndISODate}`;
    $('.CardBy').text(exhDates);

    $('.--medium').hide();
    $('.--dimensions').hide();
    $('.Thumbnail').hide();
    let desc = data.CurNotes ? data.CurNotes : "Description not available.";
    let desc_text = `This is an exhibit. ${desc}`;
    $('.CardDescription').text(desc_text);
  }
  $('.Info').addClass('--active');
}

function updateThumbnail(id) {
  if (thumbnail_urls[id] !== "None") {
    $('.ThumbnailImage').attr('src', thumbnail_urls[id]);
    $('.ThumbnailImage').attr('alt', `Thumbnail of ${node_data[id].title}`);
  } else {
    $('.ThumbnailImage').attr('src', '');
    $('.ThumbnailImage').attr('alt', 'Thumbnail not available.');
  }
}

/* Card buttons */
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

/* Initialization */

function chooseNodes() {
  // Randomly sample exhibit nodes
  initial_nodes = _.sample(exhibit_nodes, 5);

  // Fill list with exhibit info
  let idx = initial_nodes.length;
  while (idx--) {
    node = initial_nodes[idx];
    exh = `<li class="ExhibitChoice">
      <input type="checkbox" name="${node.id}" id="${node.id}" />
      <span class="ModalCheckbox"></span>
      <span>${exhibit_data[node._id].ExhTitle}</span>
      </li>`;
    $('.ExhibitChoices').append($(exh));
  }

  $('.ModalStart').text("Start");
  $('.ModalStart').on('click', function () {
    // Show nodes to the user
    $('.--start .ModalText').hide();
    $('.--start .ModalTitle').text("Select exhibits:");
    $('.ExhibitChoices').addClass('--active');
    $('.--start .ModalContent').append($('<button>', {
      class: 'ExhibitSubmit',
      text: 'Submit'
    }));
  })
}

$('.Modal').on('click', '.ExhibitSubmit', function(){
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
    $('.Modal').removeClass('--active');
  }else{
    alert("Please choose at least one exhibit.");
  }
});

$('.Modal').on('click', '.ExhibitChoice', function() {
  let $input = $(this).children('input')[0];
  $input.checked = !$input.checked;
});

$('.ModalClose').on('click', function(){
  $('.Modal').removeClass('--active');
});

/* Modal Links */

$('.ModalLink').on('click', function(){
  let $a = $(this).find('a');
  if ($a.attr('href') === '#about'){
    $('.Modal.--about').addClass('--active');
  }else if ($a.attr('href') === '#help'){
    $('.Modal.--help').addClass('--active');
  }
})