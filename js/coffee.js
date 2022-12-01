// Updated D3 to V7
var chart;
var height = 200;
var width = 300;
//DEFINE YOUR VARIABLES UP HERE
const BAR_COLOR = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728"];

//Gets called when the page is loaded.
function init() {
  chart = d3
    .select("#vis")
    .append("svg")
    .attr("width", width + 100)
    .attr("height", height + 100);
  vis = chart.append("g");
  //PUT YOUR INIT CODE BELOW
  d3.csv("data/CoffeeData.csv").then(update);
}

//Called when the update button is clicked
function updateClicked() {
  d3.csv("data/CoffeeData.csv").then(update);
}

//Callback for when data is loaded
function update(rawdata) {
  //PUT YOUR UPDATE CODE BELOW
  vis.remove();
  vis = chart.append("g");

  var x = getXSelectedOption();
  var y = getYSelectedOption();

  // Data Transformation
  const transformed_data = {};
  rawdata.forEach(function (d) {
    if (transformed_data[d[x]] == undefined) {
      transformed_data[d[x]] = parseInt(d[y]);
    } else {
      transformed_data[d[x]] += parseInt(d[y]);
    }
  });
  const data = Object.keys(transformed_data).map(function (key) {
    return { x: key, y: transformed_data[key] };
  });
  console.log(data);

  // Scales
  var xScale = d3.scaleBand().range([0, width]).padding(0.4);
  var yScale = d3.scaleLinear().range([height, 0]);

  // Axis
  var g = vis
    .attr("width", width + 100)
    .attr("height", height + 100)
    .append("g")
    .attr("transform", "translate(" + 50 + "," + 50 + ")");

  xScale.domain(
    data.map(function (d) {
      return d.x;
    })
  );

  yScale.domain([
    0,
    d3.max(data, function (d) {
      return d.y;
    }),
  ]);

  g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale))
    .append("text")
    .attr("y", -10)
    .attr("x", width + 15)
    .attr("text-anchor", "end")
    .attr("stroke", "black")
    .text(x);

  g.append("g")
    .call(
      d3
        .axisLeft(yScale)
        .tickFormat(function (d) {
          return "$" + d;
        })
        .ticks(10)
    )
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
    .attr("stroke", "black")
    .text(y);

  // Bars
  g.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", function (d) {
      return xScale(d.x);
    })
    .attr("y", function (d) {
      return yScale(d.y);
    })
    .attr("fill", function (d, i) {
      // return d3.interpolateRainbow(Math.random());// random color
      return BAR_COLOR[i];
    })
    .attr("width", xScale.bandwidth())
    .attr("height", function (d) {
      return height - yScale(d.y);
    });
}

// Returns the selected option in the X-axis dropdown. Use d[getXSelectedOption()] to retrieve value instead of d.getXSelectedOption()
function getXSelectedOption() {
  var node = d3.select("#xdropdown").node();
  var i = node.selectedIndex;
  return node[i].value;
}

// Returns the selected option in the X-axis dropdown.
function getYSelectedOption() {
  var node = d3.select("#ydropdown").node();
  var i = node.selectedIndex;
  return node[i].value;
}
