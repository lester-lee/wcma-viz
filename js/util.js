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