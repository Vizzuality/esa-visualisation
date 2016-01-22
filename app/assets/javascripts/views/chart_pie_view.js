'use strict';

/**
 * Chart pie view
 * @param  {Object} App Global object
 */
(function(App) {

  App.View = App.View || {};

  App.View.ChartPie = Backbone.View.extend({

    events: {
    },

    defaults: {
      chartEl: '#pie-chart',
      animationTime: 400,
      outerRadius: 40,
      removeTimeout: 300,
      margin: {
        top: 30,
        right: 40,
        bottom: 40,
        left: 40
      }
    },

    /**
     * This function will be executed when the instance is created
     * @param  {Object} params
     */
    initialize: function(params) {
      this.options = _.extend({}, this.defaults, params || {});
      this.data = this.options.data;
      this.chartEl = this.options.chartEl;
      this.margin = this.options.margin;
      this.outerRadius = this.options.outerRadius;
      this.animationTime = this.options.animationTime;
      this.removeTimeout = this.options.removeTimeout;

      this._render();
    },

    _render: function() {
      this._setUpGraph();
      this._parseData();
      this._renderGraph();
    },

    _setUpGraph: function() {
      var el = this.el;
      var margin = this.margin;
      this.cWidth = el.clientWidth;
      this.cHeight = el.clientHeight;

      this.cWidth = this.cWidth - margin.left - margin.right;
      this.cHeight = this.cHeight - margin.top - margin.bottom;
      this.radius = Math.min(this.cWidth - this.outerRadius, this.cHeight - this.outerRadius) / 2;

      this.svg = d3.select(el).append('svg')
        .attr('width', this.cWidth + margin.left + margin.right)
        .attr('height', this.cHeight + margin.top + margin.bottom)
        .append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    },

    _parseData: function() {
      var self = this;

      this.chartData = [
        {
          category: '1971',
          value: 10,
          color: '#EA01FF'
        },
        {
          category: '2001',
          value: 40,
          color: '#FF6600'
        },
        {
          category: '2005',
          value: 10,
          color: '#229A00'
        },
        {
          category: '2010',
          value: 30,
          color: '#7801FF'
        },
        {
          category: '2010',
          value: 30,
          color: '#ffc600'
        }
      ];
    },

    _tweenPie: function(finish) {
      var self = this;
      var start = {
        startAngle: 0,
        endAngle: 0
      };
      var i = d3.interpolate(start, finish);

      return function(d) { return self.arc(i(d)); };
    },

    _tweenPieOut: function(b) {
      var self = this;
      var start = {
        startAngle: b.startAngle, 
        endAngle: b.endAngle
      };

      b.startAngle = 0;
      b.endAngle = 0;
      b.value = 0;
      
      var i = d3.interpolate(start, b);
      return function(t) {
        return self.arc(i(t)); 
      };
    },

    _renderGraph: function() {
      var self = this;

      this.arc = d3.svg.arc()
        .outerRadius(this.radius)
        .innerRadius(0);

      var pie = d3.layout.pie()
        .value(function(d) { return d.value });

      var container = this.svg.append('g')
        .attr('class', 'container')
        .attr('transform', 'translate(' + (this.cWidth / 2) + ', ' + 
          ((this.cHeight / 2)  - (this.margin.top / 2)) + ')');

      this.pie = container.selectAll('.arc')
        .data(pie(this.chartData))
        .enter().append('g')
          .attr('class', 'arc');

      this.pie.append('path')
        .attr('d', this.arc)
        .style('fill', function(d) { return d.data.color })
        .style('stroke', function(d) { return d.data.color })
        .transition()
        .duration(this.animationTime)
        .attrTween('d', this._tweenPie.bind(this));
    },

    prepareRemove: function() {
      this.svg.selectAll('path').transition()
        .duration(this.animationTime)
        .attrTween('d', this._tweenPieOut.bind(this));

      if (this.removeTimer) {
        clearTimeout(this.removeTimer);
        this.removeTimer = null;
      }

      this.removeTimer = setTimeout(this.remove.bind(this), this.removeTimeout);
    },
    
    remove: function() {
      if(this.svg) {
        var svgContainer = this.el.querySelector('svg');

        this.svg.remove();
        this.svg = null;
        this.el.removeChild(svgContainer);
      }
    }
  });

})(window.App || {});