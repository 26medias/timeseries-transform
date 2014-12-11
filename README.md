# Timeseries Transform #

Timeseries analysis tool.

Process and analyze timeseries.

Compatible with both Nodejs and client-side javascript.


The demo (index.html - client-side) includes charting using Highcharts.

## Doc ##

### Setup ###

	var t2 = new timeseriesTransform(data);


### Apply a transform ###

Example: Bollinger's Bands

	var bands 	= t2.transform('bollinger', {
		period:	20,
		stdev:	2,
		value:	'c'	// Value to use for the calculation
	});

### Get stats ###

	var stdev = t2.stats.stdev(false, {value:'c'});
	var mean = t2.stats.mean(false, {value:'c'});

# License: MIT #
Copyright (c) 2014 Julien Loutre, Twenty-Six Medias, Inc

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.