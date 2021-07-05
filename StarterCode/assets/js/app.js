// @TODO: YOUR CODE HERE!

// SVG wrapper dimensions are determined by the current width and
// height of the browser window.

var svgWidth = 960;
var svgHeight = 720;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Append SVG element

var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)

// Append group element

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Read CSV


d3.csv('./assets/data/data.csv').then(function (incomeData) {
  

// parse data
  incomeData.forEach(function (data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
  });

// create scales

  var xLinearScale = d3.scaleLinear()
    .domain([8, d3.max(incomeData, d => d.poverty)])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([4, d3.max(incomeData, d => d.healthcare)])
    .range([height, 0]);

// create axes

  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

// append axes

  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

// append circles

  var circlesGroup = chartGroup.selectAll("circle")
  .data(incomeData)
  .enter()
  .append("g")

  circlesGroup.append("circle")
  .attr("cx", d => xLinearScale(d.poverty))
  .attr("cy", d => yLinearScale(d.healthcare))
  .attr("r", "10")
  .attr("fill", "blue")
  .attr("opacity", ".5")

  circlesGroup.append("text")
  .style("font-size", "10px")
  .style("font-weight", "bold")
  .text(function (d) {
    console.log(d.abbr);
    return d.abbr;
  })
  .attr("x",function (d) {
    return xLinearScale(d.poverty - 0.13);
  })
  .attr("y", function (d) {
    return yLinearScale(d.healthcare - 0.1);
  })

// Initialize Tooltip

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -70])
    .html(d =>
      `${d.state}<br>In Poverty: ${d.poverty}<br>Lacks Healthcare %: ${d.healthcare}%`
    );
 // Create the tooltip in chartGroup.

  chartGroup.call(toolTip);

  // Create "mouseover" event listener to display tooltip

  circlesGroup.on("mouseover", function (incomeData) {
      toolTip.show(incomeData);
    })
  // Create "mouseout" event listener to hide tooltip

    .on("mouseout", function (incomeData, index) {
      toolTip.hide(incomeData);
    });

 // Labelling the axis

  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height * 0.6))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("% Lacks Healthcare $");

  chartGroup.append("text")
    .attr("transform", `translate(${width * 0.4}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("In Poverty ($)");
});