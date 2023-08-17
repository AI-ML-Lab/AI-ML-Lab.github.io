const width = window.innerWidth;
const height = window.innerHeight;

const svg = d3.select('#graph')
    .attr('width', width)
    .attr('height', height);

d3.json('data/data.json').then(data => {
  const nodes = data.nodes;
  const links = data.links;
  
  const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id))
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(width / 2, height / 2));
  
  const link = svg.selectAll('.link')
    .data(links)
    .enter().append('line')
    .attr('class', 'link');
  
  const node = svg.selectAll('.node')
    .data(nodes)
    .enter().append('circle')
    .attr('class', 'node')
    .attr('r', 10)
    .on('mouseover', handleMouseOver) // Add mouseover event handler
    .on('mouseout', handleMouseOut)
    .on('click', (event, d) => handleNodeClick(event, d));  // Add click event handler
  
  node.append('title')
    .text(d => d.name);

  const tooltip = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0.5);
  
  function handleMouseOver(d) {
    d3.select(this).attr('r', 15); // Increase node size on mouseover
    d3.select(this).append('title').text(d => d.name); 
  }
  
  function handleMouseOut(d) {
    d3.select(this).attr('r', 10);
    tooltip.transition().duration(500).style('opacity', 0);
  }

  function handleNodeClick(event, d) {
    console.log(d);
    window.location.href = d.url; // Navigate to the URL
  }
  
  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);
  
    node
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);
  });
});