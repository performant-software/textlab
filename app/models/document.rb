class Document < ActiveRecord::Base
      	
  has_many :leafs, dependent: :destroy
  has_many :document_sections, dependent: :destroy
  has_many :document_nodes, dependent: :destroy
        
  def self.get_all()
		documents = Document.all
		documents.map { |document| document.list_obj }
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
  
  def documentNodesJSON=(nodes_json)
    # TODO merge this list of nodes with server's list of nodes
  end
  
  def list_obj
    { 
      id: self.id,
      name: self.name
    }
  end
  
  def obj
    leafsJSON = self.leafs.map { |leaf| leaf.obj }
    sectionsJSON = self.document_sections.map { |section| section.obj }
    nodesJSON = self.document_nodes.map { |node| node.obj }
    
    { 
      id: self.id,
      name: self.name,
      leafs: leafsJSON,
      sections: sectionsJSON,
      document_nodes: nodesJSON
    }
  end
  
end