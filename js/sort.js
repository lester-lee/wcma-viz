---
---
$('.Sort.--color').on('click', function(){
  console.log("yo");
  simulation.stop();
  nodeElements
    .attr('cx', node => getColorX(node))
    .attr('cy', node => getColorY(node));
  $('.Links').hide();
  color_mode = true;
});

function getColorX(node){
  let color = getNodeColor(node);
  let $color = chroma(color);
  let l = $color.hsl()[2];
  let margin = width / 4;
  return  margin + l * width * .5;
}

function getColorY(node){
  let color = getNodeColor(node);
  let $color = chroma(color);
  let h = $color.hsl()[0];
  if (isNaN(h)){
    h = 0;
  }
  let margin = height / 5;
  return margin + (h / 360) * height * .5;
}