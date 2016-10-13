class Document < ActiveRecord::Base
      	
  belongs_to :user
  has_many :leafs, dependent: :destroy
  has_many :document_sections, dependent: :destroy
  has_many :document_nodes, dependent: :destroy
  has_many :memberships, dependent: :destroy
        
  def self.get_all( current_user )
		documents = Document.where( user_id: current_user.id )
		owned_docs = documents.map { |document| document.list_obj() }
    team_docs = current_user.memberships.map { |membership| membership.document.team_list_obj(membership) }
    (owned_docs + team_docs).sort_by { |doc| doc[:name] } 
	end  
  
  after_create do |document|
    root_section = DocumentSection.new
    root_section.document = self
    root_section.name = self.name
    root_section.save

    root_node = DocumentNode.new
    root_node.document = self
    root_node.position = 0
    root_node.document_section = root_section
    root_node.save
  end
  
  def is_owner?(current_user_id)
    ( !self.user_id.nil? && self.user_id == current_user_id )
  end
  
  def root_node
    self.document_nodes.where({ document_node_id: nil, document_id: self.id }).first
  end
  
  def team_list_obj( membership )
    {
      id: self.id,
      name: self.name,
      description: self.description,
      owner_name: self.user.email,
      membership_id: membership.id,
      accepted: membership.accepted,
      owner: false
    }
  end
      
  def list_obj()
    { 
      id: self.id,
      name: self.name,
      description: self.description,
      owner: true,
      published: self.published
    }
  end
  
  def obj(current_user_id=nil)
    leafsJSON = self.leafs.map { |leaf| leaf.obj }
    sectionsJSON = self.document_sections.map { |section| section.obj }
    nodesJSON = self.document_nodes.map { |node| node.obj }
    membersJSON = self.memberships.map { |membership| membership.obj }
    
    { 
      id: self.id,
      name: self.name,
      description: self.description,
      leafs: leafsJSON,
      sections: sectionsJSON,
      document_nodes: nodesJSON,
      members: membersJSON,
      owner: self.is_owner?(current_user_id),
      published: self.published
    }
  end
  
  def import_document!( manuscript_guid )

    # note: this fn assumes document is empty to start
    root_node = self.root_node
    position = 0
    
    # create all folders and their contents
    TlFolder.where({ manuscript_id: manuscript_guid }).order(:name).each { |folder|
      section = DocumentSection.new
      section.document = self
      section.name = folder.name
      section.save!

      node = DocumentNode.new
      node.document = self
      node.position = position
      node.document_node_id = root_node.id
      node.document_section = section
      node.save!
      position = position + 1

      leaf_position = 0
      folder.tl_transcriptions.where( ownedby: 'admin' ).order(:name).each { |transcription|
        leaf_position = transcription.import_leaves!( node, self, leaf_position, manuscript_guid )
      }
    }

    # import the transcriptions that aren't in folders
    TlTranscription.where({ tl_folder_id: nil, manuscriptid: manuscript_guid, ownedby: 'admin' }).order(:name).each { |transcription|
      position = transcription.import_leaves!( root_node, self, position, manuscript_guid )
    }
    
  end
  
end