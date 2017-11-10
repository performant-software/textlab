(function() { this.JST || (this.JST = {}); this.JST["textlab/templates/open-tab-dialog"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<div class="modal fade" id="open-tab-modal" tabindex="-1" role="dialog" aria-labelledby="open-tabModal">\n  <div class="modal-dialog" role="document">\n    <div class="modal-content">\n      <div class="modal-header">\n        <button type="button" class="close cancel-button" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n        <h4 class="modal-title" id="open-tabModal">Open Tab</h4>\n      </div>\n      <div class="modal-body">      \n        ',  partials.dropdownInput( { 
            field_name: 'tab', 
            field_title: 'Tabs', 
            field_value: '', 
            field_instructions: 'Select an existing transcription or sequence.', 
            no_blank: true,
            options: tabs,
            error: false 
          }) ,'    \n      </div>      \n      <div class="modal-footer">\n        <button type="button" class="btn btn-default cancel-button">Cancel</button>\n        <button type="button" class="btn btn-primary ok-button">OK</button>\n      </div>\n    </div>\n  </div>\n</div>\n');}return __p.join('');};
}).call(this);
