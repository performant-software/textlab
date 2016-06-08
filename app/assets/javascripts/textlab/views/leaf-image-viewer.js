TextLab.LeafImageViewer = Backbone.View.extend({

	template: _.template("<div id='openseadragon'></div>"),
    
  id: 'leaf-image-viewer',
            	
	initialize: function(options) {
    
    _.bindAll( this, "drag_handler", "dragEnd_handler", "press_handler" );
    this.hit_item = null;
    
    this.tileSource = '{"type":"legacy-image-pyramid","levels":[{"url":"https://staging-uploads-juxtaeditions.s3.amazonaws.com/uploads-juxtaeditions.s3.amazonaws.com/uploads/1422303907274-3mlxforsfydjkyb9-35ecdf6c89905871192303efb67f3d16/Page2-3.jpg","width":336,"height":530},{"url":"https://staging-uploads-juxtaeditions.s3.amazonaws.com/uploads-juxtaeditions.s3.amazonaws.com/uploads/1422303907274-3mlxforsfydjkyb9-35ecdf6c89905871192303efb67f3d16/Page2-2.jpg","width":671,"height":1059},{"url":"https://staging-uploads-juxtaeditions.s3.amazonaws.com/uploads-juxtaeditions.s3.amazonaws.com/uploads/1422303907274-3mlxforsfydjkyb9-35ecdf6c89905871192303efb67f3d16/Page2-1.jpg","width":1342,"height":2117},{"url":"https://staging-uploads-juxtaeditions.s3.amazonaws.com/uploads/1422303907274-3mlxforsfydjkyb9-35ecdf6c89905871192303efb67f3d16/Page2.jpg","width":2683,"height":4234}]}';
    
  },
  
  drag_handler: function(event) {
      if (this.hit_item) {
          var transformed_point1 = paper.view.viewToProject(new paper.Point(0,0));
          var transformed_point2 = paper.view.viewToProject(new paper.Point(event.delta.x, event.delta.y));
          this.hit_item.position = this.hit_item.position.add(transformed_point2.subtract(transformed_point1));
          this.viewer.setMouseNavEnabled(false);
          paper.view.draw();
      }
  },
  
  dragEnd_handler: function(event) {
      if (this.hit_item) {
          this.viewer.setMouseNavEnabled(true);
      }
      this.hit_item = null;
  },
  
  press_handler: function(event) {
      this.hit_item = null;
      var transformed_point = paper.view.viewToProject(new paper.Point(event.position.x, event.position.y));
      var hit_test_result = paper.project.hitTest(transformed_point);
      if (hit_test_result) {
          this.hit_item = hit_test_result.item;
      }
  },
      
  render: function() {        
    this.$el.html(this.template()); 
  },
  
  renderImage: function() {      
        
		this.viewer = OpenSeadragon({
			id : "openseadragon",
			prefixUrl : "/openseadragon/",
      debugMode:  false,
      visibilityRatio: 1.0,
      constrainDuringPan: true,
      showNavigator: true,
      zoomPerScroll: 1.8
		});
    
    this.overlay = this.viewer.paperjsOverlay();
    
    var paint_circles = function(overlay, event) {
      var circles = [
        {
          "pixel_x": 100,
          "pixel_y": 100,
          "radius": 100
        },
        {
          "pixel_x": 400,
          "pixel_y": 400,
          "radius": 50
        }
      ];

      var num_circles = circles.length;
      for (var i = 0; i < num_circles; i++) {
        var circle = circles[i];
        var circle = new paper.Path.Circle(new paper.Point(circle.pixel_x, circle.pixel_y), circle.radius);
        circle.fillColor = 'red';
        circle.visible = true;
        circles.push(circle);
        circle.onMouseDown = function (event) {
        console.log("circle.onMouseDown" , "event.point.x = ", event.point.x , "event.point.y = ", event.point.y);
        };
      }
      overlay.resize();
      overlay.resizecanvas();
    }.bind(null, this.overlay);
    
    new OpenSeadragon.MouseTracker({
      element: this.viewer.canvas,
      pressHandler: this.press_handler,
      dragHandler: this.drag_handler,
      dragEndHandler: this.dragEnd_handler
    }).setTracking(true);
        
    this.viewer.addTiledImage({
        tileSource: this.tileSource,
        x: 0,
        y: 0,
        success: paint_circles
    });
  }
	
  
});