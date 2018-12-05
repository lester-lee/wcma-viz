---
---
$('.Sort.--color').on('click', function(){
  simulation.stop();
  nodeElements
    .attr('cx', node => getColorX(node))
    .attr('cy', node => getColorY(node));
  $('.Links').hide();
  color_mode = true;
});

function getColorX(node){
  let $color = chroma(node.colors[0]);
  let l = $color.hsl()[2];
  let margin = width / 4;
  return margin + l * width * .5;
}

function getColorY(node){
  let $color = chroma(node.colors[0]);
  let h = $color.hsl()[0];
  if (isNaN(h)){
    h = 0;
  }
  let margin = height / 5;
  return margin + (h / 360) * height * .5;
}