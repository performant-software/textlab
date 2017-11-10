(function() { this.JST || (this.JST = {}); this.JST["textlab/templates/edit-settings-dialog"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<div class="modal fade" id="edit-settings-modal" tabindex="-1" role="dialog" aria-labelledby="settingsModal">\n  <div class="modal-dialog" role="document">\n    <div class="modal-content">\n      <div class="modal-header">\n        <button type="button" class="close cancel-button" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n        <h4 class="modal-title" id="settingsModal">Edit Project Settings</h4>\n      </div>\n      <div class="modal-body">\n        <h4>Publishing Settings</h4>\n        ',  partials.checkMark( { 
            field_name: 'published', 
            field_title: publishFieldTitle,
            field_value: document.published, 
            error: false 
          }) ,'\n        \n        <h4>General Settings</h4>\n        ',  partials.stringInput( { 
            field_name: 'name', 
            field_title: "Project Name",
            field_value: document.name, 
            field_instructions: "Please enter a name for this project.",
            error: false 
          }) ,'        \n        ',  partials.stringInput( { 
            field_name: 'description', 
            field_title: "Project Description",
            field_value: document.description, 
            field_instructions: "Please enter a brief description of this project.",
            error: false 
          }) ,'    \n        ',  partials.dropdownInput( { 
            field_name: 'projectConfig', 
            field_title: 'Project Configuration', 
            field_value: document.project_config_id, 
            field_instructions: 'Project configuration determines the tags and vocabs.', 
            no_blank: true,
            options: projectConfigs,
            error: false 
          }) ,'       \n      \n      <h4>Project Members</h4>  \n      <div id="members-panel"></div>\n      </div>\n      <div class="modal-footer">\n        <button type="button" class="btn btn-default cancel-button">Cancel</button>\n        <button type="button" class="btn btn-primary update-button">Update</button>\n      </div>\n    </div>\n  </div>\n</div>\n');}return __p.join('');};
}).call(this);
