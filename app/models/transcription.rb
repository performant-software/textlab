# NOTE: This class is only used for migrating data from the previous version of TextLab

class Transcription < ActiveRecord::Base
  
  belongs_to :folder
  
  
  
  def import_leaf!( parent_node, document )

    # clear old TL codes
    content = self.transcriptiontext.gsub(/__\S+\s/,'')

    leaf = Leaf.new( { 
      name: self.name, 
      content: content,
      document_id: document.id
    })
    
    leaf.save!
          
    document_node = DocumentNode.new( {
      document_node_id: parent_node.id,
      document_id: document.id,
      position: 0,
      leaf_id: leaf.id
    })
    
    document_node.save!    
  end
    
end