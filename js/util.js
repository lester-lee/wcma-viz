---
---

function getNodeColors(n) {
  return (node) => {
    // Return list of dominant colors from a node
    let default_colors = ["#000", "#000", "#000"];
    let exhibit_colors = ["#ffaa00", "#ffaa00", "#ffaa00"];
    if (node.node_type === "exhibit") {
      return exhibit_colors[n];
    }else if (node.node_type === "object") {
      let data = node_data[node._id];
      let colors = data.dominant_colors;
      colors = colors || default_colors;
      // console.log(data, colors);
      return colors[n];
    }
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