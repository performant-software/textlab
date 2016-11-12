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

  # when nodes are removed, update sibling positions
  before_destroy do |document_node|
    unless self.parent_node.nil?
      delete_at = document_node.position
      children = self.parent_node.child_nodes.order(:position)
      step = delete_at
      children.each do |child|
        if child.id != document_node.id && child.position >= delete_at 
          child.position = step
          step = step + 1
          child.save
        end
      end
    end  
  end

  def prev_leaf
    if self.position > 0 
      node = DocumentNode.find_by( document_node_id: self.parent_node, position: self.position-1 )
      transcription = node.leaf.published_transcription if node.leaf
      unless transcription.nil?
        return transcription
      else
        return node.prev_leaf
      end
    else
      return nil
    end
  end

  def next_leaf
    siblings = self.parent_node.child_nodes

    if self.position < (siblings.length-1)
      node = DocumentNode.find_by( document_node_id: self.parent_node, position: self.position+1 )
      transcription = node.leaf.published_transcription if node.leaf
      unless transcription.nil?
        return transcription
      else
        return node.next_leaf        
      end
    else
      return nil
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
      document_node_id: self.parent_node.nil? ? nil : self.parent_node.id,
      leaf_id: self.leaf.nil? ? nil : self.leaf.id,
      document_section_id: self.document_section.nil? ? nil : self.document_section.id
    }
  end
    
end