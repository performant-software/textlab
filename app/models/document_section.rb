class DocumentSection < ActiveRecord::Base
  
  belongs_to :document  
  has_one :document_node, dependent: :destroy
  
  def base_html
    base_content = ""
    document_node.child_nodes.order(:position).each { |child_node|  
      if !child_node.leaf.nil?
        child_node.leaf.transcriptions.each { |transcription|
          if transcription.published
            Diplo.create_diplo!( transcription ) unless transcription.diplo
            base_content << thumb_html( child_node.leaf, transcription )
            base_content << transcription.diplo.html_content if transcription.diplo and !transcription.diplo.error
          end        
        }        
      end 
    }
    base_content
  end
  
  def subsections
    document_node.child_nodes.order(:position).map { |child_node|  
      child_node.document_section
    }.compact
  end
  
  def thumb_html( leaf, transcription )
    # IIIF format {scheme}://{server}{/prefix}/{identifier}/{region}/{size}/{rotation}/{quality}.{format}            
    thumb_url = "#{leaf.tile_source}/full/150,/0/default.jpg"          
    diplo_url = "/transcriptions/#{transcription.id}.html"
    "<a href='#{diplo_url}'><img class='thumb' src='#{thumb_url}'/></a>"
  end
  
  def obj    
    { 
      id: self.id,
      name: self.name
    }
  end
  
end