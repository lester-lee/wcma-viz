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

function getClassificationColor(node){
  if (node.node_type === "exhibit"){
    return exhibit_color;
  }else{
    let data = node_data[node._id];
    let clss = data.classification;
    clss = clss.substr(5).toUpperCase();
    return classification_colors[classifications[clss]];
  }
}

function getNodeColor(node){
  if (node.node_type === "exhibit"){
    return exhibit_color;
  }else{
  // Look for color that is furthest from beige
    let beige = chroma("#c9c3b9");
    let data = node_data[node._id];
    let dominant_colors = data.dominant_colors;
    if (!dominant_colors){
      return default_color;
    }
    let res_color = default_color;
    let max_dist = 0;
    let idx = dominant_colors.length;
    while (idx--){
      let cur_color = chroma(dominant_colors[idx]);
      let cur_dist = chroma.distance(beige, cur_color, 'rgb');
      console.log(cur_color, cur_dist);
      if (cur_dist > max_dist){
        max_dist = cur_dist;
        res_color = cur_color;
      }
    }
    console.log(res_color.hex());
    return res_color.hex();
  }
}

function hexToHsl(hex){
  // First convert hex to rgb
  let rgb = [];
  for (let i = 1; i < 7; i += 2){
    rgb.push(parseInt(hex.substr(i,2),16));
  }
  return rgbToHsl(rgb[0], rgb[1], rgb[2]);
}

function rgbToHsl(r, g, b) {
  /* w3color.js ver.1.18 by w3schools.com (Do not remove this line)*/
  /* https://www.w3schools.com/colors/colors_converter.asp */
  var min, max, i, l, s, maxcolor, h, rgb = [];
  rgb[0] = r / 255;
  rgb[1] = g / 255;
  rgb[2] = b / 255;
  min = rgb[0];
  max = rgb[0];
  maxcolor = 0;
  for (i = 0; i < rgb.length - 1; i++) {
    if (rgb[i + 1] <= min) {min = rgb[i + 1];}
    if (rgb[i + 1] >= max) {max = rgb[i + 1];maxcolor = i + 1;}
  }
  if (maxcolor == 0) {
    h = (rgb[1] - rgb[2]) / (max - min);
  }
  if (maxcolor == 1) {
    h = 2 + (rgb[2] - rgb[0]) / (max - min);
  }
  if (maxcolor == 2) {
    h = 4 + (rgb[0] - rgb[1]) / (max - min);
  }
  if (isNaN(h)) {h = 0;}
  h = h * 60;
  if (h < 0) {h = h + 360; }
  l = (min + max) / 2;
  if (min == max) {
    s = 0;
  } else {
    if (l < 0.5) {
      s = (max - min) / (max + min);
    } else {
      s = (max - min) / (2 - max - min);
    }
  }
  s = s;
  return {h : h, s : s, l : l};
}