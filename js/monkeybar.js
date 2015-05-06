// To access monkeybar id:
// d3.select(this).attr("id");

function monkeyBar() {
	var width = 100,
		height = 500,
		x = 0,
		y = 0,
		lineHeight = 20;
		padding = 1;

		function mB(selection) {
			selection.each(function(d,i) {
				
				var name = selection
						.append("g")
						.attr("class", "name");

					name
						.append("rect")
						.attr("width", width - padding)
						.attr("height", lineHeight - padding);

					name
						.append("text")
						.attr("x", width/2)
				        .attr("y", lineHeight/1.4)
						.text(function(d){return d.name.toUpperCase();});

			});
		};

		mB.width = function(value) {
    		if (!arguments.length) return width;
    		width = value;
    		return mB;
  		};

		mB.height = function(value) {
    		if (!arguments.length) return height;
    		height = value;
    		return mB;
  		};

		mB.x = function(value) {
    		if (!arguments.length) return x;
    		x = value;
    		return mB;
  		};

		mB.y = function(value) {
    		if (!arguments.length) return y;
    		y = value;
    		return mB;
  		};

  		return mB;

};