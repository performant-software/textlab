# NOTE: This class is only used for migrating data from the previous version of TextLab

class TlTranscription < ActiveRecord::Base
  
  belongs_to :folder
  
  def padded_image_id( image_id )     
        
    id_num = image_id.to_i
    zeros = "";

    if id_num < 10 
      zeros = zeros + "0"
    end
    
    if id_num < 100 
      zeros = zeros + "0"
    end
    
    if id_num < 1000 
      zeros = zeros + "0"
    end
    
    zeros + image_id;
  end
  
  def import_leaf!( parent_node, document, position )

    # clear old TL codes
    content = self.transcriptiontext.gsub(/__\S+\s/,'')

    # see if we can discern which leaf image was used by looking at the pb tag.
    match_image_id = content.match(/<pb facs="#img_(\d+)"\/>/)
    image_url = nil
    unless match_image_id.nil?
      image_source_id = self.padded_image_id( match_image_id[1] )      
      image_url = "http://mel-iip.performantsoftware.com/iipsrv/iipsrv.fcgi?IIIF=billy/modbm_ms_am_188_363_#{image_source_id}.tif"
    end

    leaf = Leaf.new( { 
      name: self.name, 
      content: content,
      tile_source: image_url,
      document_id: document.id
    })
    
    leaf.save!
          
    document_node = DocumentNode.new( {
      document_node_id: parent_node.id,
      document_id: document.id,
      position: position,
      leaf_id: leaf.id
    })
    
    document_node.save!    
  end
    
end