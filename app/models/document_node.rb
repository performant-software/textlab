class DocumentNode < ActiveRecord::Base
  
  belongs_to :document
  belongs_to :parent_node, foreign_key: 'document_node_id', class_name: 'DocumentNode'
  has_many   :child_nodes, foreign_key: 'document_node_id', class_name: 'DocumentNode'
  belongs_to :leaf
  belongs_to :document_section
  
  # when nodes are added, update sibling positions
  before_create do |document_node|
    unless self.parent_node.nil?
      insert_at = document_node.position
      children = self.parent_node.child_nodes.order(:position)
      step = insert_at + 1
      children.each do |child|
        if child.position >= insert_at 
          child.position = step
          step = step + 1
          child.save
        end
      end
    end
  end

  def ancestor_nodes
    ancestors = []
    
    node = self
    while !node.parent_node.nil?
      ancestors.push node.parent_node
      node = node.parent_node
    end
  
    ancestors
  end
        
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