function timeseriesTransform(data) {
	this.data	= data;
	if (!this.data) {
		this.data = [];
	}
	
	this.loadIndicators();
	this.loadStats();
}
timeseriesTransform.prototype.transform = function(name, options) {
	if (this.indicators.hasOwnProperty(name)) {
		return this.indicators[name](this.data, options);
	} else {
		return false;
	}
}
timeseriesTransform.prototype.loadIndicators = function() {
	var scope = this;
	this.indicators = {
		bollinger:	function(data, options) {
			options = _.extend({
				period:		20,
				stdev:		2,
				value:		'c'
			}, options);
			
			var i;
			var j;
			var l 	= data.length;
			var sum	= 0;
			
			// Leave the datapoints [0;period[ intact
			var bands	= [];
			
			for (i=0;i<options.period;i++) {
				bands[i] = {
					d:		data[i].d,
					up:		null,
					mid:	null,
					down:	null
				}
			}
			
			for (i=options.period;i<l;i++) {
				sum	= 0;
				for (j=options.period;j>0;j--) {
					sum += data[i-j][options.value];
				}
				var avg = sum/options.period;
				
				// Calculate the stdev
				var stdev = scope.stats.stdev(data.slice(i-options.period, i), {value:options.value});
				
				bands[i] = {
					d:		data[i].d,
					up:		avg+(stdev*options.stdev),
					mid:	avg,
					down:	avg-(stdev*options.stdev)
				};
			}
			
			return bands;
		}
	};
}
timeseriesTransform.prototype.loadStats = function() {
	var scope = this;
	this.stats = {
		stdev:	function(data, options) {
			options = _.extend({
				value:	'v'
			}, options);
			
			if (!data) {
				data = scope.data;
			}
			
			var sum 	= 0;
			var n 		= 0;
			
			var mean 	= scope.stats.mean(data, {value:options.value});
			_.each(data, function(datapoint) {
				sum += (datapoint[options.value]-mean)*(datapoint[options.value]-mean);
				n++;
			});
			return Math.sqrt(sum/n);
		},
		mean:	function(data, options) {
			options = _.extend({
				value:	'v'
			}, options);
			
			if (!data) {
				data = scope.data;
			}
			
			var sum 	= 0;
			var n 		= 0;
			_.each(data, function(datapoint) {
				sum += datapoint[options.value];
				n++;
			});
			return sum/n;
		}
	};
}

if (module) {
	module.exports = timeseriesTransform;
}
