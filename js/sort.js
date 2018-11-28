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
  let color = getNodeColors(0)(node);
  let hsl = hexToHsl(color);
  let margin = width / 4;
  return  margin + hsl.l * width * .5;
}

function getColorY(node){
  let color = getNodeColors(0)(node);
  let hsl = hexToHsl(color);
  let margin = height / 5;
  return margin + (hsl.h / 360) * height * .5;
}