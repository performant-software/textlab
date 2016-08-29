class Document < ActiveRecord::Base
      	
  has_many :leafs, dependent: :destroy
  has_many :document_sections, dependent: :destroy
  has_many :document_nodes, dependent: :destroy
        
  def self.get_all()
		documents = Document.all
		documents.map { |document| document.list_obj }
	end  
  
  after_create do |document|
    # create starting leaf.
    first_leaf = Leaf.new
    first_leaf.tile_source = Leaf.test_source
    first_leaf.document = self
    first_leaf.save
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
      documentNodes: nodesJSON
    }
  end
  
end