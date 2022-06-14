TextLab.XMLEditor = Backbone.View.extend({

template: JST['textlab/templates/xml-editor'],
facsTemplate: _.template("<span class='facs-ref' id='<%= id %>'><%= name %></span>"),
openTagTemplate: _.template("<<%= tag %><%= attributes %>>"),
closeTagTemplate: _.template("</<%= tag %>>"),
emptyTagTemplate: _.template("<<%= tag %><%= attributes %>/>"),
pbTagAttrTemplate: _.template(" facs='#<%= xml_id %>'"),

id: 'xml-editor',

events: {
	'click .lb-mode-button': 'onClicklbMode',
	'click .pb-button': 'onClickpbMode',
	'click .tag-menu-item': 'onClickTagMenuItem',
	'click .zone-link': 'onClickZoneLink',
	'click .preview-button': 'onClickPreview',
	'click .relink-button': 'onClickRelink',
	'click .publish-button': 'onClickPublish',
	'click .unpublish-button': 'onClickUnPublish',
	'click .share-button': 'onClickShare',
	'click .stop-sharing-button': 'onClickStopSharing',
	'click .submit-button': 'onClickSubmit',
	'click .return-button': 'onClickReturn',
	'click .rename-button': 'onClickRename',
	'click .delete-button': 'onClickDelete',
  'click .copy-button': 'onClickCopy'
},

autoSaveDelay: 1000,


initialize: function(options) {
	_.bindAll(this, "onEnter", "requestAutosave", "save", "onDrop");
	this.lbEnabled = false;
	this.leaf = options.leaf;
	this.config = options.config;

	// tags with special behaviors
	this.lbTag = this.config.tags['lb'];
	this.pbTag = this.config.tags['pb'];

	this.tabbedEditor = options.tabbedEditor;
	this.zoneLinkMarkers = [];
},

onDrop: function(cm, dragEvent) {

	// don't proceed if transcription is read only
	if (this.model.isReadOnly(this.tabbedEditor.projectOwner)) return false;

	// if a file was dropped
	if (dragEvent.dataTransfer.files) {
		var filename = dragEvent.dataTransfer.files[0].name;
		var parts = filename.split('.');
		if (parts.length > 1) {
			var partsMinusExt = _.first(parts, parts.length - 1);
			filename = partsMinusExt.join('.');
		}

		// rename this transcription based on this filename.
		this.model.set('name', filename);
		this.save(_.bind(function() {
			this.tabbedEditor.renameTab('transcription', this.model.id, filename);
		}, this));
	}
},

activateTagDialog: function(tagID, zone) {

	var tag = this.config.tags[tagID];

	if (tag.attributes) {
		var onCreateCallback = _.bind(function(attributes, children) {
			this.generateTag(tag, attributes, children);
		}, this);

		var attributeModalDialog = new TextLab.AttributeModalDialog({
			model: this.model,
			config: this.config,
			zone: zone,
			tag: tag,
			callback: onCreateCallback
		});
		attributeModalDialog.render();
	} else {
		this.generateTag(tag);
	}
},

onClickTagMenuItem: function(event) {
	var target = $(event.currentTarget);
	var tagID = target.attr("data-tag-id");

	// are we coming from drop down? if so, hide it
	if (!target.hasClass('toolbar-button')) {
		this.$('#xml-tag-dropdown').dropdown('toggle');
	}

	this.activateTagDialog(tagID);

	return false;
},

onClicklbMode: function() {
	var lbModeButton = this.$('.lb-mode-button');

	if (this.lbEnabled) {
		lbModeButton.removeClass('active');
		this.lbEnabled = false;
	} else {
		lbModeButton.addClass('active');
		this.lbEnabled = true
	}
	this.editor.focus();
	return false;
},

onClickpbMode: function() {
	if (this.pbTag) {
		var attrString = this.pbTagAttrTemplate({
			xml_id: this.leaf.get('xml_id')
		});
		var attributes = {
			attrString: attrString
		};
		this.generateTag(this.pbTag, attributes);
		return false;
	}
},

// Handle relinking
onClickRelink: function(){
	this.relinkZones();
	document.activeElement.blur();
},
relinkZones: function(){

	// Look for 'facs' and re-mark them as needed
	contents = this.editor.getValue();
	const regex = /facs=["|'](#.+?_\d*-?\d*["|'])/g;

	// Build a LUT of valid possible zoneLinks
	var validZonelinks = [];
	var leafID=this.leaf.attributes.xml_id;

  for (var key in this.model.zones._byId) {
    var zoneLabel = this.model.zones._byId[key].attributes.zone_label;
    var thisID = leafID + "-" + zoneLabel;
    validZonelinks.push(thisID);
  }

	// Add mark
	var validLinksInText = [];
	while ((match = regex.exec(contents)) != null) {

		// If this match is a pb link, don't bother
		var labelPrefix = this.model.getZoneLabelPrefix();
		var hasID = match[0].split(labelPrefix);
		if(hasID.length > 1){

			// Check if valid
			var cssClass = 'broken-zone-link';
			var zonelinkID=match[1].split("#")[1].slice(0, -1);
			if(validZonelinks.indexOf(zonelinkID)>-1){
				validLinksInText.push(zonelinkID.split("-")[1]);
				cssClass = 'zone-link';
			}

			// We add 6 because the match includes prefix: facs=["|']
			var startIndex = match.index+6;

			// Match[1] is actual match, so that forms our end
			var endIndex = (match.index + match[0].length)-1;

			var doc = this.editor.getDoc();
			var position = doc.posFromIndex(startIndex);
			var endPos = doc.posFromIndex(endIndex);
			doc.markText(position, endPos, {
				className: cssClass,
				atomic: true
			});
		}
	}


	// Finally, adjust the leaf representation of the link (dashed or dotted) and redraw paper
	// This used to be syncZoneLinks: from surface-view.js
	_.each(paper.project.activeLayer.children, function(item) {
		if (item.data.zone) {
			var zoneRect = item.children['zoneRect'];
			var dashPattern = [50, 10];
			var thisZoneRectLinkID = zoneRect.parent.data.zone.attributes.zone_label;
			zoneRect.dashArray = (validLinksInText.indexOf(thisZoneRectLinkID)>-1) ? '' : dashPattern;
		}
	}, this);
	paper.view.draw();

},

onClickPreview: function() {
	if (this.model.id) {
		window.open("/transcriptions/" + this.model.id, '_blank');
	} else {
		alert("This transcription is blank or could not be saved, unable to preview.")
	}
},

onClickPublish: function() {
	this.tabbedEditor.starTab('transcription', this.model.id);
},

onClickUnPublish: function() {
	this.tabbedEditor.unStarTab('transcription', this.model.id);
},

onClickShare: function() {
	this.updateSharing(true);
	return false;
},

onClickStopSharing: function() {
	this.updateSharing(false);
	return false;
},

onConfigChanged: function(config) {
	this.config = config;
},

updateSharing: function(shared) {
	this.$('#action-dropdown').dropdown('toggle');
	this.model.set('shared', shared);

	this.save(_.bind(function() {
		var shareButton = this.$('.share-button');
		var stopShareButton = this.$('.stop-sharing-button');

		if (shared) {
			shareButton.addClass('hidden');
			stopShareButton.removeClass('hidden');
		} else {
			stopShareButton.addClass('hidden');
			shareButton.removeClass('hidden');
		}
	}, this));
},

onClickSubmit: function() {
	this.$('#action-dropdown').dropdown('toggle');

	var submitConfirmed = confirm("Do you wish to submit this transcription for publication?");

	if (submitConfirmed) {
		this.tabbedEditor.submitTab('transcription', this.model);
	}

	return false;
},

onClickReturn: function() {
	this.$('#action-dropdown').dropdown('toggle');

	var returnConfirmed = confirm("Do you wish to return this transcription to its owner?");

	if (returnConfirmed) {
		this.tabbedEditor.returnTab('transcription', this.model);
	}

	return false;
},

onClickRename: function() {
	var onUpdateCallback = _.bind(function() {
		this.save(_.bind(function() {
			this.tabbedEditor.renameTab('transcription', this.model.id, this.model.get('name'));
		}, this));
	}, this);

	var transcriptionDialog = new TextLab.TabDialog({
		model: this.model,
		callback: onUpdateCallback,
		mode: 'edit'
	});
	transcriptionDialog.render();
	return false;
},

onClickDelete: function() {
	this.$('#action-dropdown').dropdown('toggle');

	var deleteConfirmed = confirm("Do you wish to delete the transcription titled '" + this.model.get('name') + "'? ");

	if (deleteConfirmed) {
		this.tabbedEditor.deleteTab('transcription', this.model);
	}

	return false;
},

onClickCopy: function () {
  const onCopyCallback = _.bind(function(name) {
    this.model.copy({ name }, _.bind((attributes) => {
      const editorModel = TextLab.Transcription.newTranscription(this.model, attributes);
      this.tabbedEditor.selectTab(this.tabbedEditor.openXMLEditorTab(editorModel))
    }, this));
  }, this);

  const tabDialog = new TextLab.CopyDialog({ callback: onCopyCallback });
  tabDialog.render();
},

togglePublishButton: function(buttonState) {
	if (buttonState) {
		this.$('.unpublish-button').addClass('hidden');
		this.$('.publish-button').removeClass('hidden');
	} else {
		this.$('.publish-button').addClass('hidden');
		this.$('.unpublish-button').removeClass('hidden');
	}
},

onEnter: function() {
	if (this.lbEnabled && this.lbTag) {
		this.generateTag(this.lbTag);
	}
},

save: function(callback) {

	var onError = function() {
		$('.error-message').html('ERROR: Unable to save changes.');
		TextLab.Routes.routes.onError();
	};

	var onSuccess = function() {
		//console.log("Saving...");
		$('.error-message').html('');
		if (callback) {
			callback();
		}
	};

	// Update the model with the contents of the editor and then save it
	var doc = this.editor.getDoc();
	this.model.set("content",doc.getValue());
	this.model.save(null, {
		success: onSuccess,
		error: onError
	});
},

startAutosaveTimer: function() {
	// start a timer
	this.autoSaveTimerID = window.setTimeout(this.save, this.autoSaveDelay);
},

requestAutosave: function() {
	this.stopAutosaveTimer();
	this.startAutosaveTimer();
},

stopAutosaveTimer: function() {
	// clear the current timer
	window.clearTimeout(this.autoSaveTimerID);
},

getSelection: function() {
	var doc = this.editor.getDoc();
	return doc.getSelection();
},

generateTag: function(tag, attributes, children) {
	var doc = this.editor.getDoc();
	var from = doc.getCursor("from");
	var to = doc.somethingSelected() ? doc.getCursor("to") : null;

	if (children && children.length > 0) {
		// for child tags - put down first tag with optional selection
		// then put down n more tags (no selection)
		var childFrom = from;
		var childTo = to;
		_.each(children, function(child) {
			var tagEnd = this.generateSingleTag(child.tag, child, childFrom, childTo);
			childFrom = tagEnd;
			childTo = null;
		}, this);

		// parent will encompass all children that were inserted.
		to = childFrom;
	}

	this.generateSingleTag(tag, attributes, from, to);
	this.editor.focus();
},

generateSingleTag: function(tag, attributes, from, to) {
	var insertion;
	var doc = this.editor.getDoc();
	var attrString = attributes ? attributes.attrString : "";

	if (tag.empty) {
		insertion = this.emptyTagTemplate({
			tag: tag.tag,
			attributes: attrString
		});
	} else {
		var openTag = this.openTagTemplate({
			tag: tag.tag,
			attributes: attrString
		});
		var body = "";
		// only need to populate body if insertion is a range.
		if (to) {
			body = doc.getRange(from, to);
			var existingMarks = doc.findMarks(from, to);
			var existingMarkOffsets = _.map(existingMarks, function(existingMark) {
				var markPos = existingMark.find();
				return doc.indexFromPos(markPos.from) + openTag.length;
			}, this);
		}
		var closeTag = this.closeTagTemplate(tag);
		insertion = openTag + body + closeTag;
	}

	// if a range is selected, replace it. Otherwise, insert at caret.
	doc.replaceRange(insertion, from, to);

	// Relink the zones
	this.relinkZones();

	var endIndex = doc.indexFromPos(from) + insertion.length;
	return doc.posFromIndex(endIndex);
},

// A zonelink has been deleted from the leaf
removeZoneLink: function(removedZone) {
	// Relink zones
	this.relinkZones();
},

setSurfaceView: function(surfaceView) {
	// Relink zones
	this.relinkZones();

	// Set the surface view
	this.surfaceView = surfaceView;
},

onClickZoneLink: function(e) {
	var xmlZoneLabel = $(e.currentTarget).html();
	var zoneLabel = this.model.removeZoneLabelPrefix(xmlZoneLabel);
	var zone = this.model.zones.getZoneByLabel(zoneLabel);
	this.surfaceView.selectZone(zone);
	return false;
},

initZoneLinks: function() {
	// Relink the zones
	this.relinkZones();
},

render: function() {

	var showPublishButton = this.tabbedEditor.projectOwner;
	var showSubmitButton = !this.tabbedEditor.projectOwner;
	var showReturnButton = (this.tabbedEditor.projectOwner && this.model.get('submitted'));
	var showActionMenu = (this.model.get('owner') && !this.model.get('submitted'));
	var showTags = !this.model.isReadOnly(this.tabbedEditor.projectOwner);

	var statusMessage = "";
	if (this.model.get('submitted')) {
		if (this.tabbedEditor.projectOwner) {
			statusMessage = "Transcription submitted by: " + this.model.get('owner_name');
		} else {
			statusMessage = "Transcription submitted for publication."
		}
	} else if (this.model.get('shared') && this.model.isReadOnly()) {
		statusMessage = "Transcription shared by: " + this.model.get('owner_name');
	}

	var dropDownTags = [];
	_.each(this.config.tags, function(tag, key) {
		if (tag.omitFromMenu != true) {
			dropDownTags.push(key);
		}
	});

	this.$el.html(this.template({
		tags: dropDownTags,
		showPublishButton: showPublishButton,
		showSubmitButton: showSubmitButton,
		showReturnButton: showReturnButton,
		showActionMenu: showActionMenu,
		published: this.model.get('published'),
		submitted: this.model.get('submitted'),
		shared: this.model.get('shared'),
		showTags: showTags,
		statusMessage: statusMessage
	}));
},

initEditor: function() {

	var readOnly = this.model.isReadOnly(this.tabbedEditor.projectOwner);
	var editorEl = this.$("#codemirror").get(0);


	// Load editor, callbacks for loading modal
	// This gets called once per editor tab (not editor window)
	this.editor = CodeMirror.fromTextArea(
		editorEl, {
			mode: "xml",
			lineNumbers: true,
			lineWrapping: true,
			readOnly: readOnly
		});


	if (readOnly) {
		this.$(".CodeMirror").addClass('read-only');
		this.$(".CodeMirror-gutters").addClass('read-only');
	}

	var doc = this.editor.getDoc();
	if (this.model && this.model.get('content')) {
		doc.setValue(this.model.get('content'));
	}

	if (this.model) {
		this.initZoneLinks();
	}
	doc.clearHistory();

	this.$el.keydown(_.bind(function(e) {
		if (e.keyCode == 13) {
			this.onEnter();
		}
	}, this));

	this.editor.on('drop', this.onDrop);

	// save as we go
	this.editor.on("change", this.requestAutosave);

	// Handle paste operations
	this.editor.on("change", _.bind(function(cm, change) {
		// Exit if change isn't paste
		if (change.origin != "paste") return;

		// Relink zones
		this.relinkZones();

	}, this));
}
});
