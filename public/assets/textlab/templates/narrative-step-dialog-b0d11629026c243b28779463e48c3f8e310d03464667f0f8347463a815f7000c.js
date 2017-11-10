(function() { this.JST || (this.JST = {}); this.JST["textlab/templates/narrative-step-dialog"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<div class="modal fade" id="step-modal" tabindex="-1" role="dialog" aria-labelledby="stepModal">\n  <div class="modal-dialog" role="document">\n    <div class="modal-content">\n      <div class="modal-header">\n        <button type="button" class="close cancel-button" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n        <h4 class="modal-title" id="documentModal">',  (mode=='edit'? 'Edit' : 'New') ,' Step</h4>\n      </div>\n      <div class="modal-body">\n\n        ',  partials.dropdownInput( { 
            field_name: 'zone_id', 
            field_title: 'Zone', 
            field_value: model.zone_id, 
            field_instructions: "Please select the zone referenced in this step.", 
            no_blank: true,
            options: zones,
            error: false 
          }) ,'\n\n        <b>Transcription at this step:</b>\n        <div id="step">',  model.step ,'</div>\n\n        <b>Narrative of this step:</b>\n        <div id="narrative">',  model.narrative ,'</div>\n\n      </div>\n      <div class="modal-footer">\n        <button type="button" class="btn btn-default cancel-button">Cancel</button>\n        <button type="button" class="btn btn-primary ok-button">OK</button>\n      </div>\n    </div>\n  </div>\n</div>\n');}return __p.join('');};
}).call(this);
