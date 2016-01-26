//= require jquery2
//= require jquery_ujs
//= require slick.js/slick.js
//= require underscore
//= require backbone
//= require d3
//= require_self
//= require router
//= require_tree ./cartocss
//= require views/map_view
//= require views/map_basemap_view
//= require views/chart_line_view
//= require views/chart_pie_view
//= require views/chart_bar_view
//= require views/timeline_view
//= require views/legend_view
//= require views/dashboard_view
//= require views/slider_view
//= require views/search_view
//= require views/tabs_view
//= require controllers/map_controller
//= require collections/case_study_collection

'use strict';

(function(root) {

  var App = root.App = {
    View: {},
    Model: {},
    Controller: {},
    Events: _.clone(Backbone.Events)
  };

  var ApplicationView = Backbone.View.extend({

    events: {
      'click #btnBurguer': '_toggleMenu',
    },

    /**
     * This function will be executed when the instance is created
     */
    initialize: function() {
      this.router = new root.App.Router();
      this.data = this._getAppData();

      // Start application
      this._start();
    },

    /**
     * Function to start the application
     * Initializing the slider, the listeners and
     * starting the router.
     */
    _start: function() {
      this.menu = document.getElementById('menu');
      this._initSearch();
      this._setListeners();
      this.router.start();
    },

    /**
     * Function to set events at beginning
     */
    _setListeners: function() {
      this.listenTo(this.router, 'start:slider', this._setSliderPageFromUrl);
    },

    /**
     * Function to set the app's data from the 'gon' namespace
     * provided by the view.
     */
    _getAppData: function() {
      var data = {};

      if (gon && gon.case_study) {
        data.case_study = JSON.parse(gon.case_study);
      }

      if (gon && gon.cartodb_user) {
        data.cartodb_user = gon.cartodb_user;
      }

      return data;
    },

    /**
     * Function to set the current slider page
     */
    _setCurrentSliderPage: function(page) {
      this.sliderPage = page;
      this.router.trigger('route:update', {
        page: page.toString()
      });
    },

    /**
     * Function to update slide current page from the url
     */
    _setSliderPageFromUrl: function(page) {
      this.sliderPage = page;
      this._initSlider(page);
    },

    /**
     * Function to initialize the slider
     */
    _initSlider: function(page) {
      this.slider = new App.View.Slider({
        el: '#mainSlider',
        initialSlide: parseInt(page)
      });

      this.listenTo(this.slider, 'slider:initialized', this.initMap);
      this.listenTo(this.slider, 'slider:page', this._setCurrentSliderPage);
      this.listenTo(this.slider, 'slider:change', this.initMap);

      this.slider.start();
    },

    /**
     * Function to initialize the search box form
     */
    _initSearch: function() {
      this.search = new App.View.Search({
        el: '#casesSearch'
      });
    },

    /**
     * When the type of slide is 'map' the map view will be initialized
     * else the map will be removed to improve the performance.
     * @param  {String} slideType It could be cover, text or map
     */
    initMap: function() {
      var el = document.querySelectorAll("[data-slick-index='"+ this.sliderPage +"']")[0];

      if (this.map) {
        this.map.remove();
        this.map = null;
      }

      if (el.firstElementChild.getAttribute('data-type') === 'map') {
        this.map = new App.Controller.Map({
          elContent: el,
          data: this.data,
          page: this.sliderPage
        });
      }
    },

    /**
     * Function to open or close the navigation element
     * @param  {Event} e
     */
    _toggleMenu: function(e) {
      e.preventDefault();
      e.currentTarget.classList.toggle('_active');
      this.menu.classList.toggle('_active');
    }

  });

  function onReady() {
    new ApplicationView({ el: document.body });
  }

  document.addEventListener('DOMContentLoaded', onReady);

})(window);
