module EditingPermissions
  extend ActiveSupport::Concern
  
  def filter_by_permissions(params, current_user_id)
    valid_keys = []
    owner = (self.user_id == current_user_id)
    doc_owner = (self.document.user_id == current_user_id)

    # can this owner edit the content?
    if owner && !self.submitted
      valid_keys.concat( self.content_fields )
    end

    # can the doc owner edit the content?
    if (owner != doc_owner) && (doc_owner && self.submitted)
      valid_keys.concat( self.content_fields )
    end    

    # can this user share or unshare this doc?
    valid_keys.push(:shared) if owner 

    # can they publish or unpublish it?
    valid_keys.push(:published) if doc_owner

    if params[:submitted]
      # can they submit it?
      valid_keys.push(:submitted) if !self.submitted && owner 
    else
      # can they return it?
      valid_keys.push(:submitted) if self.submitted && doc_owner
    end

    filtered_params = {}
    valid_keys.each { |valid_key|
      filtered_params[valid_key] = params[valid_key]
    }

    filtered_params
  end

end