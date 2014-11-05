var StreamGraph = (function (d3, _) {
  var SVG,
      metrics = ["offers", "shares", "landings", "leads", "purchases", "friends"],
      duration = 1500,
      width = 600,
      height = 500,
      summaryMetrics = {};

  var summaryMetricPoint = function (d) {
    return _.values( summaryMetrics )[d];
  };

  var fixPath = function (path) {
    var Lidx = path.indexOf('L');
    var Cidx = path.slice(Lidx).indexOf('C');
    var PCidx = path.slice(0, Lidx).lastIndexOf('C');
    var lp = path.substr(PCidx, Lidx - PCidx);
    var ss = path.substr(Lidx, Cidx);
    return (path.slice(0, Lidx) + lp + ss + path.slice(Lidx));
  };

  return {
    render: function (el, data) {
      var margin = {top: 10, right: 80, bottom: 10, left: 0},
          w = width - margin.right - margin.left, /*  */
          h = height - margin.top - margin.bottom,
          svg, stack, coords = [], layers, x, y, color, area, axisY;

      if (!SVG) {
        SVG = d3.select(el)
          .attr("width", width)
          .attr("height", height)
          .append("svg:g")
          .attr("transform", "translate(" + margin.bottom + "," + margin.top + ")");

      }

      svg = SVG;
      stack = d3.layout.stack().offset("expand");

      y = d3.scale.linear()
          .domain([0, 1])
          .range([w, 0]);

      color = d3.scale.linear()
          .range(["#258700", "#acdf9a"]);

      _.each( metrics, function (metric, key) {
        summaryMetrics[metric] = 0;

        _.each( data, function (company, i) {
          coords[i] = coords[i] || [];

          coords[i].push({
            x: key,
            y: company['metrics'][metric]
          });

          /* Total amount on every metric for selected companies */
          summaryMetrics[metric] += company['metrics'][metric];
        });
      });

      layers = stack(coords);

      layers = _.map( data, function (company, i) {
        return { layer: layers[i], title: company.title};
      });

      x = d3.scale.linear()
        .domain([0, metrics.length - 1])
        .range([0, h]);

      area = d3.svg.area()
        .x0(function (d) {
          return y(null);
        })
        .x1(function (d) {
          return y(d.y0 + d.y);
        })
        .y(function (d) {
          return x(d.x);
        });

      svg.selectAll("path").filter(":not(.domain)")
         .transition()
         .duration( duration )
         .attr("data", function(currentCompany) {
            var currentTitle = currentCompany.title;

            _.each( data, function (company) {
              if (currentTitle && currentTitle === company.title) {
                d3.select(this).remove();

                return;
              }
            }, this);
        });

      svg.selectAll("path").filter(":not(.domain)")
        .data(layers.reverse())
        .enter().append("path")
        .attr("d", function (d) {
          return fixPath( area(d.layer) );
        })
        .transition()
        .duration( duration );

      svg.selectAll("path").filter(":not(.domain)")
        .data(layers)
        .transition()
        .duration( duration )
        .attr("d", function (d, i) {
          d3.select(this).style({
            "fill": color(i / 8)
          });

          return fixPath(area(d.layer));
        });

      svg.selectAll('.y.axis').remove();

      axisY = d3.svg.axis()
                    .scale(x)
                    .ticks(6)
                    .tickFormat(summaryMetricPoint)
                    .tickSize(-w)
                    .orient("right")
                    .tickSubdivide(true);

      svg.append("svg:g")
         .attr("class", "axis y")
         .attr("transform", "translate(" + w + ",0)")
         .style('fill', '#000')
         .call(axisY);
    }
  };
}(d3, _));