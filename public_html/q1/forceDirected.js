$("#return").click(function(){
    self.location= "../index.html";
});



var width = 1200,
    height = 800;

var color = d3.scale.category10();

var svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

var force = d3.layout.force()
            .gravity(0.05)
            .distance(100)
            .charge(-100)
            .size([width, height]);
var title = d3.select("svg").append("g")
                .attr("class","title");

title.append("text")
    .attr("x",(width/2))
    .attr("y",30)
    .attr("text-anchor","middle")
    .style("font-size","22px")
    .text('Force Directed Graph Layout of Network about "Books about US Politics"');
    


d3.json("./polBooks.json", function(error, json) {

    if (error) throw error;

    force.nodes(json.nodes)
            .links(json.links)
            .start();

    var link = svg.selectAll(".link")
            .data(json.links)
            .enter()
            .append("line")
            .attr("class", "link");

    var node = svg.selectAll(".node")
            .data(json.nodes)
            .enter()
            .append("g")
            .attr("class", "node")
            .on("mouseover", mouseover)
            .on("mouseout", mouseout)
            .call(force.drag);

    node.append("circle")
            .attr("r", function(d) {return d.Degree;})
            .style("fill", function(d) {
                if(d.Class==="l") return "red";
                else if(d.Class==="c") return "blue";
                else return "yellow";
            });

    node.append("image")
            .attr("xlink:href", function(d) {
                if(d.Degree>10) {
                    return "./attentionIcon.png";
                }
            })
            .attr("x", -8)
            .attr("y", -8)
            .attr("width", 16)
            .attr("height", 16);

    node.append("text")
            .attr("dx", 12)
            .attr("dy", ".35em")
            .text(function(d) {
                if(d.Degree>10) {
                    return d.Label;
                }
            });

    force.on("tick", function() {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node.attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")"; });
        });

    function mouseover() {
        d3.select(this)
                .select("circle")
                .transition()
                .duration(750)
                .attr("r", function(d) {return 3/2*d.Degree;});
    };

    function mouseout() {
        d3.select(this)
                .select("circle")
                .transition()
                .duration(750)
                .attr("r", function(d) {return 2/3*d.Degree;});
    };

});
var legend = svg.selectAll(".legend")
                .data(["c","l","n"])
                .enter().append("g")
                .attr("class","legend")
                .attr("height",15)
                .attr("transform",function(d,i){
                return "translate("+(i*40-170)+",60)";});

legend.append("rect")
        .attr("x",width-18)
        .attr("y",-1)
        .attr("width",10)
        .attr("height",10)
        .style("fill",function(d){
            if(d === "c") return "blue";
            if(d === "l") return "red";
            if(d === "n") return "yellow";
});

legend.append("text")
        .attr("x",width-24)
        .attr("y",4)
        .attr("dy",".35em")
        .style("text-anchor","end")
        .text(function(d){return d;});
