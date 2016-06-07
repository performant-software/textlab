TextLab.TestPage = Backbone.View.extend({

	template: JST['textlab/templates/test-page'],
    
  id: 'test-page',
            	
	initialize: function(options) {
  },
      
  render: function() {      
    this.$el.html(this.template({}));  
    $(".textlab-app").html(this.$el);
    
    var tileSource = '{"type":"legacy-image-pyramid","levels":[{"url":"https://staging-uploads-juxtaeditions.s3.amazonaws.com/uploads-juxtaeditions.s3.amazonaws.com/uploads/1422303907274-3mlxforsfydjkyb9-35ecdf6c89905871192303efb67f3d16/Page2-3.jpg","width":336,"height":530},{"url":"https://staging-uploads-juxtaeditions.s3.amazonaws.com/uploads-juxtaeditions.s3.amazonaws.com/uploads/1422303907274-3mlxforsfydjkyb9-35ecdf6c89905871192303efb67f3d16/Page2-2.jpg","width":671,"height":1059},{"url":"https://staging-uploads-juxtaeditions.s3.amazonaws.com/uploads-juxtaeditions.s3.amazonaws.com/uploads/1422303907274-3mlxforsfydjkyb9-35ecdf6c89905871192303efb67f3d16/Page2-1.jpg","width":1342,"height":2117},{"url":"https://staging-uploads-juxtaeditions.s3.amazonaws.com/uploads/1422303907274-3mlxforsfydjkyb9-35ecdf6c89905871192303efb67f3d16/Page2.jpg","width":2683,"height":4234}]}';
    
		window.viewer = OpenSeadragon({
			id : "openseadragon",
			prefixUrl : "/openseadragon/",
 debugMode:  false,
        visibilityRatio: 1.0,
        constrainDuringPan: true,
        showNavigator: true,
        zoomPerScroll: 1.8
		});
    
    var overlay = window.viewer.paperjsOverlay();
   
    var circles = [];
    var paintCircles = function(jsondata, overlay) {
    };
    var hit_item = null;
    var drag_handler = function(event) {
        if (hit_item) {
            var transformed_point1 = paper.view.viewToProject(new paper.Point(0,0));
            var transformed_point2 = paper.view.viewToProject(new paper.Point(event.delta.x, event.delta.y));
            hit_item.position = hit_item.position.add(transformed_point2.subtract(transformed_point1));
            window.viewer.setMouseNavEnabled(false);
            paper.view.draw();
        }
    };
    var dragEnd_handler = function(event) {
        if (hit_item) {
            window.viewer.setMouseNavEnabled(true);
        }
        hit_item = null;
    };
    
    var press_handler = function(event) {
        hit_item = null;
        var transformed_point = paper.view.viewToProject(new paper.Point(event.position.x, event.position.y));
        var hit_test_result = paper.project.hitTest(transformed_point);
        if (hit_test_result) {
            hit_item = hit_test_result.item;
        }
    };
    
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
    }.bind(null, overlay);

    new OpenSeadragon.MouseTracker({
      element: window.viewer.canvas,
      pressHandler: press_handler,
      dragHandler: drag_handler,
      dragEndHandler: dragEnd_handler
    }).setTracking(true);
    
    window.viewer.addTiledImage({
            tileSource: tileSource,
            x: 0,
            y: 0,
            success: paint_circles
        });

    window.onresize = function() {
      overlay.resize();
      overlay.resizecanvas();
      console.log("circles[0]=", circles[0]);
    };
                
  }
  
  
});