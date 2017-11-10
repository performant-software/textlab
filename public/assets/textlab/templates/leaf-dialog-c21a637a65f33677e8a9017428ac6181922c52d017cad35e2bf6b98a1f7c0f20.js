(function() { this.JST || (this.JST = {}); this.JST["textlab/templates/leaf-dialog"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<div class="modal fade" id="leaf-modal" tabindex="-1" role="dialog" aria-labelledby="leafModal">\n  <div class="modal-dialog" role="document">\n    <div class="modal-content">\n      <div class="modal-header">\n        <button type="button" class="close cancel-button" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n        <h4 class="modal-title" id="documentModal">',  (mode=='edit'? 'Edit' : 'New') ,' Leaf</h4>\n      </div>\n      <div class="modal-body">\n        ',  partials.stringInput( { 
            field_name: 'name', 
            field_title: "Name",
            field_value: leaf.get('name'), 
            field_instructions: "Please enter a unique name for this leaf.",
            error: false 
          }) ,'\n        ',  partials.stringInput( { 
            field_name: 'xml_id', 
            field_title: "XML ID",
            field_value: leaf.get('xml_id'), 
            field_instructions: "Valid XML ID for identifying this leaf.",
            error: false 
          }) ,'        \n        ',  partials.stringInput( { 
            field_name: 'tile_source', 
            field_title: "URL",
            field_value: leaf.get('tile_source'), 
            field_instructions: "Please enter a IIIF image resource URL.",
            error: false 
          }) ,'        \n      </div>\n      <div class="modal-footer">\n        ');  if( mode == 'edit') { ; __p.push('\n          <button type="button" class="btn btn-danger delete-button">Delete</button>\n        ');  }; __p.push('\n        <button type="button" class="btn btn-default cancel-button">Cancel</button>\n        <button type="button" class="btn btn-primary ok-button">OK</button>\n      </div>\n    </div>\n  </div>\n</div>\n');}return __p.join('');};
}).call(this);
