(function() { this.JST || (this.JST = {}); this.JST["textlab/templates/new-document-dialog"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<div class="modal fade" id="new-document-modal" tabindex="-1" role="dialog" aria-labelledby="documentModal">\n  <div class="modal-dialog" role="document">\n    <div class="modal-content">\n      <div class="modal-header">\n        <button type="button" class="close cancel-button" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n        <h4 class="modal-title" id="documentModal">New Project</h4>\n      </div>\n      <div class="modal-body">\n        ',  partials.stringInput( { 
            field_name: 'name', 
            field_title: "Project Name",
            field_value: "", 
            field_instructions: "Please enter a name for this project.",
            error: false 
          }) ,'        \n        ',  partials.stringInput( { 
            field_name: 'description', 
            field_title: "Project Description",
            field_value: "", 
            field_instructions: "Please enter a brief description of this project.",
            error: false 
          }) ,'        \n        ',  partials.dropdownInput( { 
            field_name: 'projectConfig', 
            field_title: 'Project Configuration', 
            field_value: _.first(projectConfigs).value, 
            field_instructions: 'Project configuration determines the tags and vocabs.', 
            no_blank: true,
            options: projectConfigs,
            error: false 
          }) ,'      \n\n        <div id="leaf-manifest-panel"></div>\n\n      </div>\n      <div class="modal-footer">\n        <div class="import-message"></div>\n        <button type="button" class="btn btn-default cancel-button">Cancel</button>\n        <button type="button" class="btn btn-primary create-button">Create Project</button>\n      </div>\n    </div>\n  </div>\n</div>\n');}return __p.join('');};
}).call(this);
