class DocumentNode < ActiveRecord::Base
  
  belongs_to :document
  belongs_to :parent_node, foreign_key: 'document_node_id', class_name: 'DocumentNode'
  belongs_to :leaf
  belongs_to :document_section
        
  def obj    
    { 
      id: self.id,
      position: self.position,
      parent_id: self.parent_node.nil? ? nil : self.parent_node.id,
      leaf_id: self.leaf.nil? ? nil : self.leaf.id,
      document_section_id: self.document_section.nil? ? nil : self.document_section.id
    }
  end
    
end