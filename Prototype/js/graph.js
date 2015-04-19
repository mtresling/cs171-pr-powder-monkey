Graph = function(_data, _x_prop, _y_prop, _svg, _width){
	this.data = _data;
	this.x_prop = _x_prop;
	this.y_prop = _y_prop;
	this.svg = _svg;
	this.width = _width;
	this.initGraph();
};

Graph.prototype.initGraph = function(){
	this.filterAndAggregate();
	this.updateGraph();
};

Graph.prototype.updateGraph = function(){
	var that = this;
	var countries = this.displaydata.map(function(d){return d.name; });
	var height = countries.length * 15;
	var max = d3.max(this.displaydata, function(d){return d.value; });
	//Scales
	this.x = d3.scale.linear()
		.domain([0, max])
        .range([0, (this.width - 200)]);
	this.y = d3.scale.ordinal()
    	.domain(countries)
    	.rangeBands([0, height]);
    // Axes
    this.x_axis = d3.svg.axis()
    	.scale(this.x)
        .orient("bottom");  
    var x_axis = this.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + 200 + "," + height + ")")
        .call(this.x_axis);      
    this.y_axis = d3.svg.axis()
    	.scale(this.y)
        .orient("left");
	var y_axis = this.svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + 200 + ",0)")
        .call(this.y_axis);
    // Graph
    var bar = this.svg.selectAll(".bar")
    	.data(this.displaydata);
    bar.enter()
    	.append("rect")
    	.attr("class", "bar");
    bar.attr("x", 200)
    	.attr("y", function(d){return that.y(d.name); })
    	.attr("width", function(d){return that.x(d.value); })
    	.attr("height", this.y.rangeBand());
    bar.exit().remove();    
};

Graph.prototype.filterAndAggregate = function (){
	var that = this;
	this.displaydata = this.data.countries.map(function(d){
		var mrv = d[that.y_prop].length - 1;	
		return {
			name: d.name,
			value: Number(d[that.y_prop][mrv].value)
		};
	});
};