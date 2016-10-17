(function() {
  d3.layout.adjacencyMatrix = function() {
    var directed = false,
        size = [1,1],
        nodes = [],
        edges = {},
        edgeWeight = function (d) {return d.weight;},
        nodeID = function (d){return d.Id;};

    function matrix() {
        var width = size[0],
            height = size[1],
            nodeWidth = width / nodes.length,
            nodeHeight = height / nodes.length,
            constructedMatrix = [],
            matrix = [],
            edgeHash = [],
            xScale = d3.scale.linear().domain([0,nodes.length]).range([0,width]),
            yScale = d3.scale.linear().domain([0,nodes.length]).range([0,height]);

//        nodes.forEach(function(node, i) {
//            node.sortedIndex = i;
//        });
        edges.forEach(function(edge) {
            var constructedEdge = {source: edge.source, 
                                    target: edge.target, 
                                    weight: edgeWeight(edge)};
            function findSource(node) { 
                return node.Id === edge.source;
            }
            function findTarget(node) { 
                return node.Id === edge.target;
            }
            constructedEdge.source = nodes.find(findSource);
            constructedEdge.target = nodes.find(findTarget);
            var id = constructedEdge.source.Id + "-" + constructedEdge.target.Id; 
            edgeHash[id] = constructedEdge;
        });

//        console.log("edgeHash", edgeHash, edgeHash.length);

        nodes.forEach(function (sourceNode, a) {
            nodes.forEach(function (targetNode, b) {
                var grid = {id: sourceNode.Id + "-" + targetNode.Id, 
                            source: sourceNode, 
                            target: targetNode, 
                            x: xScale(b), 
                            y: yScale(a), 
                            weight: 0, 
                            height: nodeHeight, 
                            width: nodeWidth};
                var mirrorGrid = {id: targetNode.Id + "-" + sourceNode.Id,
                                source: targetNode, 
                                target: sourceNode, 
                                x: xScale(a), 
                                y: yScale(b), 
                                weight: 0, 
                                height: nodeHeight, 
                                width: nodeWidth};
                var edgeWeight = 0;
                if (edgeHash[grid.id]) {
                    edgeWeight = edgeHash[grid.id].weight;
                    grid.weight = edgeWeight;
                    mirrorGrid.weight = edgeWeight;
                }else if(edgeHash[mirrorGrid.id]){
                    edgeWeight = edgeHash[mirrorGrid.id].weight;
                    grid.weight = edgeWeight;
                    mirrorGrid.weight = edgeWeight;
                }
                matrix.push(grid);
                matrix.push(mirrorGrid);
            });
        });
        console.log("matrix", matrix, matrix.length);

        return matrix;
    }

    matrix.directed = function(x) {
        if (!arguments.length) return directed;
        directed = x;
        return matrix;
    };

    matrix.size = function(x) {
        if (!arguments.length) return size;
        size = x;
        return matrix;
    };

    matrix.nodes = function(x) {
        if (!arguments.length) return nodes;
        nodes = x;
        return matrix;
    };

    matrix.links = function(x) {
        if (!arguments.length) return edges;
        edges = x;
        return matrix;
    };

    matrix.edgeWeight = function(x) {
        if (!arguments.length) return edgeWeight;
        if (typeof x === "function") {
          edgeWeight = x;
        }
        else {
          edgeWeight = function () {return x;};
        }
        return matrix;
    };

    matrix.nodeID = function(x) {
        if (!arguments.length) return nodeID;
        if (typeof x === "function") {
          nodeID = x;
        }
        return matrix;
    };

    matrix.xAxis = function(calledG) {
        var nodesName = nodes.map(nodeID);
        var i = 0;
        nodesName.forEach(function(node){
            nodesName[i] = node.substring(0,5)+"...";
            i++;
        });
        
        var nameScale = d3.scale.ordinal()
                          .domain(nodesName)
                          .rangePoints([0,size[0]],1);
        var xAxis = d3.svg.axis().scale(nameScale).orient("top").tickSize(4);

        calledG.append("g")
              .attr("class", "am-xAxis am-axis")
              .call(xAxis)
              .selectAll("text")
              .style("text-anchor", "end")
              .attr("transform", "translate(-10,-10) rotate(90)");
    };

    matrix.yAxis = function(calledG) {
        var nodesName = nodes.map(nodeID);
        var i = 0;
        nodesName.forEach(function(node){
            nodesName[i] = node.substring(0,5)+"...";
            i++;
        });
        var nameScale = d3.scale.ordinal()
                          .domain(nodesName)
                          .rangePoints([0,size[1]],1);

        yAxis = d3.svg.axis().scale(nameScale)
                          .orient("left")
                          .tickSize(4);

        calledG.append("g")
              .attr("class", "am-yAxis am-axis")
              .call(yAxis);
    };

    return matrix;
  };

})();