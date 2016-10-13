class DocumentSection < ActiveRecord::Base
  
  belongs_to :document  
  has_one :document_node, dependent: :destroy
  
  def base_html
    base_content = ""
    document_node.child_nodes.order(:position).each { |child_node|  
      if !child_node.leaf.nil?
        child_node.leaf.transcriptions.each { |transcription|
          if transcription.published and !transcription.diplo.nil?
            base_content << transcription.diplo.html_content
          end        
        }        
      end 
    }
    base_content
  end
  
  def obj    
    { 
      id: self.id,
      name: self.name
    }
  end
  
end