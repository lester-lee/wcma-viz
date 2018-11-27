---
---


function getNodeColors(n) {
  return (node) =>  {
    // Return list of dominant colors from a node
    let default_colors = ["#408fa7", "#408fa7", "#408fa7"];
    let data = node_data[node.id];
    let colors = data.dominant_colors;
    colors = colors || default_colors;
    // console.log(data, colors);
    return colors[n];
  }
}

function sample(population, k) {
  /*
      From Python standard library;
      https: //stackoverflow.com/questions/19269545/how-to-get-n-no-elements-randomly-from-an-array/45556840#45556840

      Chooses k unique random elements from a population sequence or set.

      Returns a new list containing elements from the population while
      leaving the original population unchanged.  The resulting list is
      in selection order so that all sub-slices will also be valid random
      samples.  This allows raffle winners (the sample) to be partitioned
      into grand prize and second place winners (the subslices).
  */

  if (!Array.isArray(population))
    throw new TypeError("Population must be an array.");
  var n = population.length;
  if (k < 0 || k > n)
    throw new RangeError("Sample larger than population or is negative");

  var result = new Array(k);
  var setsize = 21; // size of a small set minus size of an empty list

  if (k > 5)
    setsize += Math.pow(4, Math.ceil(Math.log(k * 3, 4)))

  if (n <= setsize) {
    // An n-length list is smaller than a k-length set
    var pool = population.slice();
    for (var i = 0; i < k; i++) { // invariant:  non-selected at [0,n-i)
      var j = Math.random() * (n - i) | 0;
      result[i] = pool[j];
      pool[j] = pool[n - i - 1]; // move non-selected item into vacancy
    }
  } else {
    var selected = new Set();
    for (var i = 0; i < k; i++) {
      var j = Math.random() * (n - i) | 0;
      while (selected.has(j)) {
        j = Math.random() * (n - i) | 0;
      }
      selected.add(j);
      result[i] = population[j];
    }
  }

  return result;
}