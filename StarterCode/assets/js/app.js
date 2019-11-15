// Define chart area
var svgWidth = 960;
var svgHeight = 600;

//Define the charts margins.
var margin = {
    top: 30,
    right: 30,
    bottom: 60,
    left: 100
};

// chart dimensions.
var chartWidth  = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Append svg to body and set dimensions
var svg = d3
    .select('#scatter')
    .append('svg')
    .attr('height', svgHeight)
    .attr('width', svgWidth)

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Read data from data.csv
    d3.csv("assets/data/data.csv")
        .then(function(data){
            data.forEach(function(data) {
                data.poverty = +data.poverty;
                data.healthcare = +data.healthcare;
              });

    // Create scale functions.
    var xLinearScale = d3.scaleLinear()
        .domain([8,d3.max(data, d => d.poverty)])
        .range([0, chartWidth]);

    var yLinearScale = d3.scaleLinear()
        .domain([0,d3.max(data, d => d.healthcare)])
        .range([chartHeight, 0]);

      // Create axis functions
      var bottomAxis = d3.axisBottom(xLinearScale);
      var leftAxis = d3.axisLeft(yLinearScale);
  
    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);
    
    chartGroup.append("g")
    .call(leftAxis);

      // Create tool tip
      var toolTip = d3
        .tip()
        .attr('class', 'tooltip')
        .offset([80, -60])
        .html(function(d) {
            return ( `${d.state}<br>In Poverty (%): ${d.poverty}<br> Lacks Healthcare (%): ${d.healthcare}`);
        });
  
      chartGroup.call(toolTip);
      
      // Generate Scatter Plot
      chartGroup
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => xLinearScale(d.poverty))
      .attr('cy', d => yLinearScale(d.healthcare))
      .attr('r', '20')
      .attr('fill', 'green')
      .attr('opacity','.5') 
      .on("mouseover",function(data) {
        toolTip.show(data, this);
      })
      // Hide and Show on mouseout
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
      svg.selectAll(".dot")
      .data(data)
      .enter()
      .append("text")
      .text(function(data) { return data.abbr; })
      .attr('x', function(data) {
        return xLinearScale(data.poverty);
      })
      .attr('y', function(data) {
        return yLinearScale(data.healthcare);
      })
      .attr("font-size", "10px")
      .attr("fill", "black")
      .style("text-anchor", "middle");
  
      chartGroup
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left + 40)
        .attr('x', 0 - chartHeight / 2)
        .attr('dy', '1em')
        .attr('class', 'axisText')
        .text('Lacking in Healthcare (%)');
  
      // x-axis labels
      chartGroup
        .append('text')
        .attr('transform',`translate(${chartWidth / 2}, ${chartHeight + margin.top + 20})`)
        .attr('class', 'axisText')
        .text('In Poverty (%)');
});
