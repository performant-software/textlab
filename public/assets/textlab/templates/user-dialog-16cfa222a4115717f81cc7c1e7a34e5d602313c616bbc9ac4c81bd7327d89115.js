(function() { this.JST || (this.JST = {}); this.JST["textlab/templates/user-dialog"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<div class="modal fade" id="user-modal" tabindex="-1" role="dialog" aria-labelledby="userModal">\n  <div class="modal-dialog" role="document">\n    <div class="modal-content">\n      <div class="modal-header">\n        <button type="button" class="close cancel-button" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n        <h4 class="modal-title" id="userModal">Edit User Account</h4>\n      </div>\n      <div class="modal-body">\n        ',  partials.stringInput( { 
            field_name: 'first_name', 
            field_title: "First Name",
            field_value: user.get('first_name'), 
            field_instructions: "Please enter a first name for this account.",
            error: false 
          }) ,'\n        ',  partials.stringInput( { 
            field_name: 'last_name', 
            field_title: "Last Name",
            field_value: user.get('last_name'), 
            field_instructions: "Please enter a last name for this account.",
            error: false 
          }) ,'\n        ',  partials.stringInput( { 
            field_name: 'username', 
            field_title: "Username",
            field_value: user.get('username'), 
            field_instructions: "Please enter a username for this account.",
            error: false 
          }) ,'\n        ',  partials.stringInput( { 
            field_name: 'email', 
            field_title: "Email",
            field_value: user.get('email'), 
            field_instructions: "Please enter a email for this account.",
            error: false 
          }) ,'\n        ');  if( isAdmin ) { ; __p.push(' \n          ',  partials.dropdownInput( { 
              field_name: 'site', 
              field_title: 'Site', 
              field_value: user.get('site_id'), 
              field_instructions: 'Site for this account.', 
              no_blank: false,
              options: sites,
              error: false 
            }) ,'  \n          ',  partials.dropdownInput( { 
              field_name: 'user_type', 
              field_title: 'User Type', 
              field_value: user.get('user_type'), 
              field_instructions: 'User Type for this account.', 
              no_blank: true,
              options: userTypes,
              error: false 
            }) ,'  \n        ');  } ; __p.push(' \n      </div>\n      <div class="modal-footer">\n        ');  if( user.get('account_status') != 'archived' ) { ; __p.push(' \n          <button data-id="',  user.id ,'" class="btn btn-danger btn-sm archive-user-button"><i class="fa fa-archive fa-lg"></i> Archive</button>\n        ');  } ; __p.push('\n        <button type="button" class="btn btn-default cancel-button">Cancel</button>\n        <button type="button" class="btn btn-primary ok-button">OK</button>\n      </div>\n    </div>\n  </div>\n</div>\n');}return __p.join('');};
}).call(this);
