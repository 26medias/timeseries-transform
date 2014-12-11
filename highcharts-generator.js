var hcGenerator = function(element, options) {
	this.options = _.extend({
		margin:	2,
		title:	''
	}, options);
	
	this.element	= element;
	
	this.panels 	= [];
	this.series		= [];
	this.markers	= [];
}


hcGenerator.prototype.panel = function(panelData) {
	panelData.id = _.uniqueId('panel-');
	this.panels.push(panelData);
	return panelData;
}
hcGenerator.prototype.serie = function(serieData) {
	serieData.id = _.uniqueId('serie-');
	this.series.push(serieData);
	return serieData;
}
hcGenerator.prototype.marker = function(markerData) {
	markerData.id = _.uniqueId('marker-');
	this.markers.push(markerData);
	return markerData;
}



hcGenerator.prototype.getPanelIndex = function(panelId) {
	var i;
	for (i=0;i<this.panels.length;i++) {
		if (this.panels[i].id == panelId) {
			return i;
		}
	}
}

hcGenerator.prototype.render = function() {
	var scope = this;
	var chartData = {
		rangeSelector: {
			selected: 1
		},
		title: {
			text: this.options.title
		},
		tooltip: {
			followPointer : true
		},
		yAxis: [],
		series: []
	}
	
	// Now we add the series
	// We'll calculate the min/max for each panel at the same time
	//var minmax = {};
	_.each(this.series, function(serie) {
		var serieData = _.extend({
			type:	'spline'
		}, serie);
		
		serieData.data	= _.map(serie.data, serie.convert);
		serieData.yAxis	= scope.getPanelIndex(serie.panel);
		/*if (!minmax.hasOwnProperty(serieData.yAxis)) {
			minmax[serieData.yAxis] = {
				min:	10000000000,
				max:	-10000000000
			};
		}
		_.each(serieData.data, function(datapoint) {
			_.each(datapoint, function(point, index) {
				// Skipe the date obvioously
				if (index > 0) {
					if (point && point < minmax[serieData.yAxis].min) {
						minmax[serieData.yAxis].min = point;
					}
					if (point && point > minmax[serieData.yAxis].max) {
						minmax[serieData.yAxis].max = point;
					}
				}
			});
		});
		*/
		chartData.series.push(serieData);
	});
	
	// Now we add the markers
	_.each(this.markers, function(marker) {
		marker = _.extend({
			shape:	'squarepin',
			type:	'flags',
			style:	{},
			events:	{}
		}, marker);
		
		if (marker.colors && marker.colors.hasOwnProperty('text')) {
			marker.style 		= _.extend(marker.style,{
				color:	marker.colors.text
			});
		}
		if (marker.colors && marker.colors.hasOwnProperty('out')) {
			marker.color 		= marker.colors.out;
			marker.fillColor 	= marker.colors.out;
		}
		if (marker.colors && marker.colors.hasOwnProperty('hover')) {
			marker.states	= {
				hover:	{
					color:		marker.colors.hover,
					fillColor:	marker.colors.hover
				}
			}
		}
		
		//delete marker.colors;
		
		chartData.series.push(marker);
	});
	
	
	// Now we build the panels
	// First we calculate the positions
	// Total height
	var totalHeight = 0;
	_.each(this.panels, function(panel) {
		totalHeight += panel.height;
	});
	totalHeight += Math.max(0,this.panels.length-1)*this.options.margin;
	console.log("totalHeight",totalHeight);
	
	// Add the panels
	var topCounter 	= 0;
	var marginPct	= this.options.margin/totalHeight*100;
	_.each(this.panels, function(panel, index) {
		chartData.yAxis.push({
			labels: {
                align: panel.align,
                x: 0
            },
            //min:	minmax[index].min,
            //max:	minmax[index].max,
            title: {
                text: panel.name
            },
            height: (panel.height/totalHeight*100).toFixed(2)+'%',
            top:	topCounter.toFixed(2)+'%',
            lineWidth: 2
		});
		topCounter += (panel.height/totalHeight*100)+marginPct;
	});
	
	console.log("chartData series",chartData.series);
	console.log("chartData yAxis",chartData.yAxis);
	this.element.highcharts('StockChart', chartData);
}