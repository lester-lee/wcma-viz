---
---

function updateCard(node){
  if (node.node_type === "object"){
    let data = node_data[node._id];
    $('.CardTitle').text(data.title);
    $('.CardBy').text(data.maker);
    $('.CardMedium').text(data.medium);
    $('.CardDimensions').text(data.dimensions);
    $('.CardDescription').text(data.description);
    $('.CardLink').attr('href', 'http://egallery.williams.edu/search/'+data.title);
  }else if (node.node_type === "exhibit"){
    let data = exhibit_data[node._id];
    console.log(data);
    $('.CardTitle').text(data.ExhTitle);
    $('.CardBy').text(data.BeginISODate + " to " + data.EndISODate)
    $('.CardMedium').text("")
    $('.CardDimensions').text("");
    $('.CardDescription').text(data.CurNotes);
  }
}