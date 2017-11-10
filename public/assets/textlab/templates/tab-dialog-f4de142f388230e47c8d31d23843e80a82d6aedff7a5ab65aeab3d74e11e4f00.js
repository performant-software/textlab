(function() { this.JST || (this.JST = {}); this.JST["textlab/templates/tab-dialog"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<div class="modal fade" id="tab-modal" tabindex="-1" role="dialog" aria-labelledby="tabModal">\n  <div class="modal-dialog" role="document">\n    <div class="modal-content">\n      <div class="modal-header">\n        <button type="button" class="close cancel-button" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n        <h4 class="modal-title" id="tabModal">',  (mode=='edit'? 'Rename' : 'New') ,' Editor</h4>\n      </div>\n      <div class="modal-body">\n        ',  partials.stringInput( { 
            field_name: 'name', 
            field_title: "Name",
            field_value: name, 
            field_instructions: "Please enter a name for this tab.",
            error: false 
          }) ,'\n        ');  if(mode!='edit') { ; __p.push(' \n          ',  partials.dropdownInput( { 
              field_name: 'editorType', 
              field_title: 'Editor Type', 
              field_value: _.first(editorTypes).value, 
              field_instructions: 'Choose the type of editor to open.', 
              no_blank: true,
              options: editorTypes,
              error: false 
            }) ,'  \n        ');  } ; __p.push('\n      </div>\n      <div class="modal-footer">\n        <button type="button" class="btn btn-default cancel-button">Cancel</button>\n        <button type="button" class="btn btn-primary ok-button">OK</button>\n      </div>\n    </div>\n  </div>\n</div>\n');}return __p.join('');};
}).call(this);
