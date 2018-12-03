---
---
let default_color = "#000000";
let exhibit_color = "#ef2bb8";
let classifications = {
  'PRINTS': 0,
  'PHOTO': 1,
  'PRENDERGAST': 2,
  'DRAWING': 3,
  'ANCIENT': 4,
  'DEC ARTS': 5,
  'RESERVE COLLECTION': 6,
  'EASTERN': 7,
  'PAINTING': 8,
  'SCULPTURE': 9,
  'AFRICAN': 10,
  'WALLS': 11,
  'AMERINDIAN': 12,
  'PACIFIC': 13
};

// Generated through Categorical http://vrl.cs.brown.edu/color
let classification_colors = ["#256676", "#6eae3d", "#711f86", "#ca81e6", "#453e7d", "#869dd3", "#0b5313", "#fc7086", "#7b4419", "#38b094", "#ac3138", "#d38f57", "#ff0087", "#96a283"];

function getClassificationColor(node) {
  if (node.node_type === "exhibit") {
    return exhibit_color;
  } else {
    let data = node_data[node._id];
    let clss = data.classification;
    clss = clss.substr(5).toUpperCase();
    return classification_colors[classifications[clss]];
  }
}

function getNodeColor(n) {
  return (node) => {
    if (node.node_type === "exhibit") {
      node.colors = [exhibit_color, exhibit_color];
      return exhibit_color;
    } else if (node.colors) {
      return node.colors[n];
    } else {
      // Choose random color
      let data = node_data[node._id];
      let dominant_colors = data.dominant_colors || [default_color, default_color];
      let colors = _.sample(dominant_colors, 2);
      node.colors = colors;
      return colors[n];
    }
  }
}
/* Try this later maybe
function getNodeColor(node){
  if (node.node_type === "exhibit"){
    node.color = exhibit_color;
    return exhibit_color;
  }else{
    // Choose random color
    let data = node_data[node._id];
    let color = _.sample(data.dominant_colors);
    node.color = color;
    return color;

  // Get brightest color
    let beige = chroma("#c9c3b9");
    let data = node_data[node._id];
    let dominant_colors = data.dominant_colors;
    if (!dominant_colors){
      return default_color;
    }
    let res_color = chroma(default_color);
    let max_dist = -1;
    let idx = dominant_colors.length;
    while (idx--){
      let cur_color = chroma(dominant_colors[idx]);
      let cur_dist = chroma.distance('gray', cur_color);
      console.log(cur_color, cur_dist);
      if (cur_dist > max_dist){
        max_dist = cur_dist;
        res_color = cur_color;
      }
    }
    console.log(res_color.hex());
    return res_color.hex();
  }
  */