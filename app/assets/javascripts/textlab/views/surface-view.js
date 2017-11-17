TextLab.SurfaceView = Backbone.View.extend({

	template: JST['textlab/templates/surface-view'],
	zonePopoverTemplate: JST['textlab/templates/zone-popover'],

	id: 'surface-view',

	events: {
		'click #add-mode-button': 'addMode',
		'click #nav-mode-button': 'navMode',
		'click #toggle-zones-button': 'toggleZones',
		'click #edit-info-button': 'onEditInfo'
	},

	dashPattern: [50, 10],
	unSelectedOpacity: 0.25,

	initialize: function(options) {
		_.bindAll(this, "onDrag", "onDragEnd", "onDragStart", "renderZone", "zoneSaved", "leafSaved", "onPopoverButton");
		this.mainViewport = options.mainViewport;
		this.tabbedEditor = options.tabbedEditor;
		this.documentTree = options.documentTree;
		this.owner = options.owner;
		this.dragStart = null;

 		$(window).on('resize', _.bind(this.onWindowResize, this));
	},

	addMode: function() {
		this.mode = 'add';
		this.viewer.setMouseNavEnabled(false);

		// if there's a selected zone, make handles visible
		if (this.selectedZoneGroup) {
			this.toggleHighlight(this.selectedZoneGroup, true);
		}

		$('#add-mode-button').addClass('active');
		$('#nav-mode-button').removeClass('active');

		return false;
	},

	navMode: function() {
		this.mode = 'nav';
		this.viewer.setMouseNavEnabled(true);

		// if there's a selected zone, make handles hide
		if (this.selectedZoneGroup) {
			this.toggleHighlight(this.selectedZoneGroup, false);
		}

		$('#nav-mode-button').addClass('active');
		$('#add-mode-button').removeClass('active');

		return false;
	},

	toggleZones: function() {

		var vizIcon = this.$('#viz-icon');
		var state = !vizIcon.hasClass('glyphicon-eye-open');

		if (state) {
			vizIcon.addClass('glyphicon-eye-open');
			vizIcon.removeClass('glyphicon-eye-close');
		} else {
			vizIcon.addClass('glyphicon-eye-close');
			vizIcon.removeClass('glyphicon-eye-open');
		}

		var zoneGroups = paper.project.getItems({
			zoneGroup: true
		});

		_.each(zoneGroups, function(zoneGroup) {
			zoneGroup.visible = state;
		}, this);

		paper.view.draw();

		return false;
	},

	onEditInfo: function(e) {
		var callback = _.bind(function(leaf) {
			this.documentTree.render();
			this.model.save(null, {
				success: this.leafSaved,
				error: TextLab.Routes.routes.onError
			});
		}, this);

		var deleteCallback = _.bind(function(leaf) {
			this.documentTree.deleteLeafNode(leaf);
			leaf.destroy({
				success: _.bind(function() {
					this.mainViewport.selectSection(null);
				}, this),
				error: TextLab.Routes.onError
			});
		}, this);

		var leafDialog = new TextLab.LeafDialog({
			model: this.model,
			callback: callback,
			deleteCallback: deleteCallback,
			mode: 'edit'
		});
		leafDialog.render();
		return false;
	},

	onPopoverButton: function(event) {
		var target = $(event.currentTarget);
		var tagID = target.attr("data-tag-id");
		var zone = this.selectedZoneGroup.data.zone;

		this.hidePopOverMenu();

		var xmlEditor = null,
			sequenceEditor = null;
		if (this.tabbedEditor.activeTab) {
			xmlEditor = this.tabbedEditor.activeTab.xmlEditor;
			sequenceEditor = this.tabbedEditor.activeTab.sequenceEditor;
		}

		if (tagID == 'new-sequence') {
			var selectedText = "";
			if (xmlEditor) {
				selectedText = xmlEditor.getSelection();
			}
			this.tabbedEditor.quickSequence(selectedText, zone.id);
			return false;
		}

		if (tagID == 'add-step') {
			sequenceEditor.activateNarrativeStepDialog(null, zone.id);
			return false;
		}

		if (xmlEditor) {
			xmlEditor.activateTagDialog(tagID, zone);
		}

		return false;
	},

	onWindowResize: function() {
		console.log('Resize...');
		this.hidePopOverMenu();
	},

	toggleHighlight: function(zoneGroup, state) {
		var zoneChildren = zoneGroup.children;

		if (!zoneGroup.visible && state) {
			zoneGroup.visible = true;
		}

		zoneChildren['zoneRect'].opacity = state ? 1.0 : this.unSelectedOpacity;
		// zoneChildren['zoneRect'].dashArray = state ? null : this.dashPattern;

		zoneChildren['backdrop'].opacity = state ? 1.0 : this.unSelectedOpacity;

		if (this.mode == 'add') {
			zoneChildren['resizeHandles'].visible = state;
			zoneChildren['deleteButton'].visible = state;
		} else {
			zoneChildren['resizeHandles'].visible = false;
			zoneChildren['deleteButton'].visible = state;
		}

		return false;
	},

	selectZone: function(zone) {
		if (!zone) return;

		// go through the items until we find the zone group for this zone
		var zoneGroup = _.find(paper.project.activeLayer.children, function(item) {
			return (item.data.zone && item.data.zone.id == zone.id);
		});
		if (this.selectedZoneGroup) {
			this.toggleHighlight(this.selectedZoneGroup, false);
		}
		this.selectedZoneGroup = zoneGroup;
		this.toggleHighlight(zoneGroup, true);
		paper.view.draw();
	},

	onDragStart: function(event) {
		this.resetDrag();
		var clickAt = paper.view.viewToProject(new paper.Point(event.position.x, event.position.y));
		var hitResult = paper.project.hitTest(clickAt);

		if (!hitResult && this.selectedZoneGroup) {
			this.toggleHighlight(this.selectedZoneGroup, false);
			this.selectedZoneGroup = null;
			this.hidePopOverMenu();
			paper.view.draw();
		}

		if (hitResult) {
			var selectedItem = hitResult.item;
			var zoneGroup = this.whichZone(selectedItem);

			if (zoneGroup) {
				// if we clicked on a different zone, then select it
				if (zoneGroup != this.selectedZoneGroup) {
					if (this.selectedZoneGroup) {
						this.toggleHighlight(this.selectedZoneGroup, false);
					}
					this.toggleHighlight(zoneGroup, true);
					this.selectedZoneGroup = zoneGroup;

					this.hidePopOverMenu();
					paper.view.draw();
				}
				// click on already selected zone
				else {
					// if we clicked on delete button, delete this zone
					if (selectedItem.data.deleteButton) {
						this.deleteZone(zoneGroup);
						return;
						// if we clicked on a resize handle, then we are in resize mode
					} else if (selectedItem.data.handle) {
						this.dragMode = "resize-zone";
						this.dragStart = clickAt;
						this.viewer.setMouseNavEnabled(false);
						this.activeDragHandle = selectedItem.data.handle;
						return;
					} else {
						this.showPopOverMenu(zoneGroup, event);
					}
				}
			}

		} else {
			if (this.mode == 'add') {
				this.dragMode = "new-zone";
				this.viewer.setMouseNavEnabled(false);
				this.dragStart = clickAt;
			}
		}
	},

	hidePopOverMenu: function() {
		if (this.popOver) {
			this.popOver.popover('destroy');
			this.popOver = null;
			this.viewer.setMouseNavEnabled(true);
		}
	},

	showPopOverMenu: function(zoneGroup, event) {

		// popover content
		var editMode = this.tabbedEditor.getEditMode();
		var secondaryEnabled = this.model.get('secondary_enabled');
		var popOverHTML = this.zonePopoverTemplate({
			editMode: editMode,
			secondaryEnabled: secondaryEnabled
		});


		// This 'event' is an OpenSeadragon event, it offers us 'position'
		// We can access mouse event as event.originalEvent. 0,0 is top center of the screen (!),
		// So we correct for that first
		this.popOver = $('.popover-anchor');
		var viewportUpperLeft = {
			"left": -(window.innerWidth / 2),
			"top": 0
		}
		this.popOver.offset({
			left: (viewportUpperLeft.left + event.originalEvent.clientX),
			top: (viewportUpperLeft.top + event.originalEvent.clientY)
		});

		var zone = zoneGroup.data.zone;
		this.popOver.popover({
			title: 'Zone ' + zone.get("zone_label"),
			placement: 'bottom',
			html: true,
			content: popOverHTML
		});

		this.viewer.setMouseNavEnabled(false);
		this.popOver.popover('show');
		$('.popover-button').click(this.onPopoverButton);
	},

	whichZone: function(item) {

		if (!item) {
			return null;
		}

		// zone groups have zone data
		if (item.data.zone) {
			return item;
		}

		return this.whichZone(item.parent);
	},

	onDrag: function(event) {
		if (this.mode != 'add' || !this.dragMode || !this.dragStart) return;

		var dragAt = paper.view.viewToProject(new paper.Point(event.position.x, event.position.y));

		if (this.dragMode == 'new-zone') {
			this.dragNewZone(dragAt);
		} else if (this.dragMode == 'resize-zone') {
			this.dragResize(dragAt);
		}

		paper.view.draw();
	},

	deleteZone: function(zoneGroup) {
		var zone = this.selectedZoneGroup.data.zone;
		var zoneLabel = zone.get('zone_label');
		zone.destroy({
			success: _.bind(function() {
				zoneGroup.remove();
				paper.view.draw();
				if (this.tabbedEditor.activeTab) {
					this.tabbedEditor.activeTab.xmlEditor.removeZoneLink(zoneLabel);
				}
			}, this),
			error: TextLab.Routes.onError
		});
	},

	dragNewZone: function(dragAt) {
		var zoneRect = {
			ulx: this.dragStart.x,
			uly: this.dragStart.y,
			lrx: dragAt.x,
			lry: dragAt.y
		};

		var zone;
		if (!this.selectedZoneGroup) {
			zone = new TextLab.Zone(zoneRect);
			this.model.addZone(zone);
		} else {
			zone = this.selectedZoneGroup.data.zone;
			zone.set(zoneRect);
			this.selectedZoneGroup.remove();
		}
		this.selectedZoneGroup = this.renderZone(zone);
		this.toggleHighlight(this.selectedZoneGroup, true);
	},

	dragResize: function(dragAt) {
		var zone = this.selectedZoneGroup.data.zone;
		var bounds = this.selectedZoneGroup.children['zoneRect'].bounds;

		if (this.activeDragHandle == 'top' && bounds.bottom > dragAt.y) {
			zone.set({
				uly: dragAt.y
			});
		} else if (this.activeDragHandle == 'left' && bounds.right > dragAt.x) {
			zone.set({
				ulx: dragAt.x
			});
		} else if (this.activeDragHandle == 'bottom' && bounds.top < dragAt.y) {
			zone.set({
				lry: dragAt.y
			});
		} else if (this.activeDragHandle == 'right' && bounds.left < dragAt.x) {
			zone.set({
				lrx: dragAt.x
			});
		}

		this.selectedZoneGroup.remove();
		this.selectedZoneGroup = this.renderZone(zone);
		this.toggleHighlight(this.selectedZoneGroup, true);
	},

	resetDrag: function() {
		this.dragStart = null;
		this.dragMode = null;
		this.activeDragHandle = null;
	},

	onDragEnd: function(event) {
		if (this.mode != 'add' || !this.dragMode || !this.dragStart) {
			this.resetDrag();
			return;
		}

		if (this.mode == 'add') {
			this.selectedZoneGroup.children['resizeHandles'].visible = true;
			var zone = this.selectedZoneGroup.data.zone;
			zone.save(null, {
				success: this.zoneSaved,
				error: TextLab.Routes.onError
			});
		}

		this.resetDrag();
	},

	zoneSaved: function(zone) {
		console.log("zone " + zone.get("zone_label") + " is saved.");
		this.model.save({
			next_zone_label: this.model.get('next_zone_label')
		}, {
			patch: true,
			success: this.leafSaved,
			error: TextLab.Routes.onError
		});
	},

	leafSaved: function(leaf) {
		console.log("leaf has been updated.");
	},

	render: function() {
		this.$el.html(this.template({
			canEditLeafInfo: this.owner
		}));
	},

	toggleZoneLink: function(zoneLabel, state) {
		var zoneGroup = _.find(paper.project.activeLayer.children, function(item) {
			return (item.data.zone && item.data.zone.get('zone_label') == zoneLabel);
		});

		if (zoneGroup) {
			var zoneRect = zoneGroup.children['zoneRect'];
			zoneRect.dashArray = state ? '' : this.dashPattern;
			paper.view.draw();
		}
	},

	// sync the state of the zone rects with zoneLinks
	syncZoneLinks: function(zoneLinks) {
		_.each(paper.project.activeLayer.children, function(item) {
			if (item.data.zone) {
				var zoneLink = _.find(zoneLinks, function(zoneLink) {
					return (zoneLink.get('zone_label') == item.data.zone.get('zone_label'));
				});

				// if we found a zone link, solid otherwise dashed rectangle
				var zoneRect = item.children['zoneRect'];
				zoneRect.dashArray = (zoneLink != null) ? '' : this.dashPattern;
			}
		}, this);

		paper.view.draw();
	},

	renderZone: function(zone) {

		// render zone rectangle
		var from = new paper.Point(zone.get("ulx"), zone.get("uly"));
		var to = new paper.Point(zone.get("lrx"), zone.get("lry"));
		var zoneItem = new paper.Path.Rectangle(from, to);
		var zoneBounds = zoneItem.bounds;

		var zoneLinks;
		if (this.tabbedEditor.activeTab && this.tabbedEditor.activeTab.transcription) {
			zoneLinks = this.tabbedEditor.activeTab.transcription.getZoneLinks(zone);
		} else {
			zoneLinks = [];
		}

		zoneItem.strokeColor = 'blue';
		zoneItem.strokeWidth = 12;
		if (zoneLinks.length == 0) {
			zoneItem.dashArray = this.dashPattern;
		}
		zoneItem.opacity = this.unSelectedOpacity;
		zoneItem.name = 'zoneRect';

		// zone id label
		var labelPosition = new paper.Point(zoneBounds.right - 120, zoneBounds.bottom - 25);
		var text = new paper.PointText(labelPosition);
		text.fontSize = 48;
		text.fillColor = 'white';
		var zoneLabel = zone.get("zone_label");
		text.content = zoneLabel ? zoneLabel : '';
		text.name = "zoneID";

		// backdrop behind label
		var backdrop = new paper.Path.Rectangle(text.bounds);
		backdrop.fillColor = 'blue';
		backdrop.opacity = this.unSelectedOpacity;
		backdrop.name = 'backdrop';

		// resize handles
		var topHandle = new paper.Path.Circle(zoneBounds.topCenter, 30);
		topHandle.fillColor = 'blue';
		topHandle.data.handle = 'top';
		var leftHandle = new paper.Path.Circle(zoneBounds.leftCenter, 30);
		leftHandle.fillColor = 'blue';
		leftHandle.data.handle = 'left';
		var rightHandle = new paper.Path.Circle(zoneBounds.rightCenter, 30);
		rightHandle.fillColor = 'blue';
		rightHandle.data.handle = 'right';
		var bottomHandle = new paper.Path.Circle(zoneBounds.bottomCenter, 30);
		bottomHandle.fillColor = 'blue';
		bottomHandle.data.handle = 'bottom';
		var resizeHandles = new paper.Group([topHandle, leftHandle, rightHandle, bottomHandle]);
		resizeHandles.name = 'resizeHandles';
		resizeHandles.visible = false;

		// delete button
		var deleteButton = new paper.Path.Circle(zoneBounds.topRight, 30);
		deleteButton.fillColor = 'red';
		deleteButton.name = 'deleteButton';
		deleteButton.visible = false;
		deleteButton.data.deleteButton = true;

		// zone group
		var zoneGroup = new paper.Group([zoneItem, resizeHandles, deleteButton, backdrop, text]);
		zoneGroup.zoneGroup = true;
		zoneGroup.data.zone = zone;

		return zoneGroup;
	},

	selectLeaf: function(leaf) {
		this.model = leaf;
		if (this.viewer) {
			this.viewer.destroy();
			this.viewReady = false;
		}
		this.viewer = null;
		this.initViewer();
	},

	initViewer: function() {

		if (!this.model) return;

		this.viewer = OpenSeadragon({
			id: "openseadragon",
			showFullPageControl: false,
			zoomInButton: 'zoom-in-button',
			zoomOutButton: 'zoom-out-button',
			showHomeControl: false,
			gestureSettingsMouse: {
				clickToZoom: false,
				dblClickToZoom: false,
				flickEnabled: false
			}
		});

		new OpenSeadragon.MouseTracker({
			element: this.viewer.canvas,
			pressHandler: this.onDragStart,
			dragHandler: this.onDrag,
			dragEndHandler: this.onDragEnd
		}).setTracking(true);

		this.overlay = this.viewer.paperjsOverlay();

		var renderZones = _.bind(function() {
			_.each(this.model.zones.models, this.renderZone, this);
			this.overlay.resize();
			this.overlay.resizecanvas();
			this.viewReady = true;
		}, this);

		this.model.getTileSource(_.bind(function(tileSource) {
			if (tileSource) {
				this.viewer.addTiledImage({
					tileSource: tileSource,
					success: renderZones
				});
			}
		}, this));

		this.navMode();
	}

});
