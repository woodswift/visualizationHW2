$("#return").click(function(){
    self.location= "../index.html";
});



d3.json("./polBooksSorted.json", createAdjacencyMatrix);

function createAdjacencyMatrix(data) {
//    console.log(data);
    var adjacencyMatrix = d3.layout.adjacencyMatrix()
                        .size([1330,1330])
                        .nodes(data.nodes)
                        .links(data.links)
                        .directed(false)
                        .nodeID(function (d) {return d.Label;});

    var matrixData = adjacencyMatrix();

//    console.log(matrixData);


        
    d3.select("svg")
        .append("g")
        .attr("transform", "translate(73,80)")
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
        .style("fill-opacity", function (d) {
            return d.weight * .8;})
        .on("mouseover", function(d){
            if(d.weight !== 0){
                //Get this bar's x/y values, then augment for the tooltip
                var xPosition = parseFloat(d3.select(this).attr("x"))+$("svg").position().left;
                var yPosition = parseFloat(d3.select(this).attr("y"))+$("svg").position().top-50;
                
                //Update the tooltip position and value
                d3.select("#tooltip")
                    .style("left", xPosition + "px")
                    .style("top", yPosition + "px")						
                    .select("#source")
                    .text(d.source.Label);
                d3.select("#sourceClass").text(d.source.Class);
                d3.select("#target").text(d.target.Label);
                d3.select("#targetClass").text(d.target.Class);
                //Show the tooltip
                d3.select("#tooltip").classed("hidden", false);
                var color = $(this).css("fill");
                $(this).css("fill","orange");
                $(this).mouseout(function(){
                    $(this).css("fill",color);
                    $(this).unbind("mouseout");
                });
            }
        })
        .on("mouseout", function() {		   
            //Hide the tooltip
            d3.select("#tooltip").classed("hidden", true);
         });;

  d3.select("#adjacencyG")
    .call(adjacencyMatrix.xAxis);

  d3.select("#adjacencyG")
    .call(adjacencyMatrix.yAxis);
    
 var legend = d3.select("svg").selectAll(".legend")
                .data(["c-c","l-l","n-n","Others"])
                .enter().append("g")
                .attr("class","legend")
                .attr("height",15)
                .attr("transform",function(d,i){
                return "translate(1450,"+(i*25+50)+")";});

legend.append("rect")
        .attr("x",20)
        .attr("y",-1)
        .attr("width",10)
        .attr("height",10)
        .style("fill",function(d){
            if(d === "c-c") return "blue";
            if(d === "l-l") return "red";
            if(d === "n-n") return "yellow";
            if(d === "Others") return "gray";
});

legend.append("text")
        .attr("x",-10)
        .attr("y",4)
        .attr("dy",".35em")
        .style("text-anchor","end")
        .text(function(d){return d;});
}


