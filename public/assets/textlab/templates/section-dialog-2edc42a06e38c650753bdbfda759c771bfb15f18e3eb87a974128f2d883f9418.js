(function() { this.JST || (this.JST = {}); this.JST["textlab/templates/section-dialog"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<div class="modal fade" id="section-modal" tabindex="-1" role="dialog" aria-labelledby="sectionModal">\n  <div class="modal-dialog" role="document">\n    <div class="modal-content">\n      <div class="modal-header">\n        <button type="button" class="close cancel-button" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n        <h4 class="modal-title" id="sectionModal">',  (mode=='edit'? 'Edit' : 'New') ,' Section</h4>\n      </div>\n      <div class="modal-body">\n        ',  partials.stringInput( { 
            field_name: 'name', 
            field_title: "Name",
            field_value: section.get('name'), 
            field_instructions: "Please enter a name for this section.",
            error: false 
          }) ,'\n\n        <div id="leaf-manifest-panel"></div>\n      </div>\n      <div class="modal-footer">\n       <div class="import-message"></div>\n        ');  if( mode == 'edit') { ; __p.push('\n          <button type="button" data-placement="bottom" data-title="Are you sure you want to delete this entire SECTION?" class="btn btn-danger delete-button">Delete</button>\n        ');  }; __p.push('\n        <button type="button" class="btn btn-default cancel-button">Cancel</button>\n        <button type="button" class="btn btn-primary ok-button">OK</button>\n      </div>\n    </div>\n  </div>\n</div>\n');}return __p.join('');};
}).call(this);
