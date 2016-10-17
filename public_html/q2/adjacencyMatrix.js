$("#return").click(function(){
    self.location= "../index.html";
});



d3.json("./polBooksSorted.json", createAdjacencyMatrix);

function createAdjacencyMatrix(data) {
//    console.log(data);
    var adjacencyMatrix = d3.layout.adjacencyMatrix()
                        .size([1350,1350])
                        .nodes(data.nodes)
                        .links(data.links)
                        .directed(false)
                        .nodeID(function (d) {return d.Label;});

    var matrixData = adjacencyMatrix();

//    console.log(matrixData);

    var someColors = d3.scale.category10();

    d3.select("svg")
        .append("g")
        .attr("transform", "translate(50,50)")
        .attr("id", "adjacencyG")
        .selectAll("rect")
        .data(matrixData)
        .enter()
        .append("rect")
        .attr("width", function (d) {return d.width;})
        .attr("height", function (d) {return d.height;})
        .attr("x", function (d) {return d.x;})
        .attr("y", function (d) {return d.y;})
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .style("stroke-opacity", .1)
        .style("fill", function (d) {
                if(d.source.Class === d.target.Class){
                    if (d.source.Class === "c") return "blue";
                    else if(d.source.Class === "l") return "red";
                    else return "yellow";
                }
                else{
                    return "gray";
                }
            })
        .style("fill-opacity", function (d) {return d.weight * .8;});

  d3.select("#adjacencyG")
    .call(adjacencyMatrix.xAxis);

  d3.select("#adjacencyG")
    .call(adjacencyMatrix.yAxis);
}


