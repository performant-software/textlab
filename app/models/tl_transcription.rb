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
  
  def import_leaf!( parent_node, document, position, manuscript_guid )

    # clear old TL codes
    content = self.transcriptiontext.gsub(/__\S+\s/,'')

    # see if we can discern which leaf image was used by looking at the pb tag.
    match_image_id = content.match(/<pb facs="#img_(\d+)"\/>/)
    image_url = nil
    unless match_image_id.nil?
      image_xml_id =  match_image_id[1]
      image_source_id = self.padded_image_id( image_xml_id )      
      image_url = "http://mel-iip.performantsoftware.com/iipsrv/iipsrv.fcgi?IIIF=billy/modbm_ms_am_188_363_#{image_source_id}.tif"
    end

    # TODO iterate through the PB tags in this transcription and cut up the transcription by pb tags
    

    leaf = Leaf.find_by( name: image_xml_id, document_id: document.id )

    # does a leaf exist already by this name? if so use it - otherwise add one
    if leaf.nil? 
      leaf = Leaf.new
      leaf.document = document    
      unless image_url.nil?
        leaf.name = image_xml_id
        leaf.tile_source = image_url
        leaf.xml_id = "img_#{image_xml_id}" if image_xml_id
      else
        # no leaf 
        leaf.name = self.name
      end
      leaf.save!
      
      document_node = DocumentNode.new
      document_node.document_node_id = parent_node.id
      document_node.document = document
      document_node.position = position
      document_node.leaf = leaf
      document_node.save!    
      position = position + 1    
    end
    
    # load the zone data for this leaf
    if image_xml_id
      tl_leaf = TlLeaf.where({ name: image_xml_id, manuscriptid: manuscript_guid }).first
      if tl_leaf
        revision_sites = TlRevisionSite.where( { leafid: tl_leaf.leaf_guid })
        revision_sites.each { |revision_site|
          revision_site.import_zone!( leaf, 1.0 )
        }
      end
    end
            
    # TODO does this user exist already? if not, create them and add them to this project
    # user = User.find_or_create_by( )
    user_id = document.user.id
    
    # add this transcription to the selected leaf
    transcription = Transcription.new({ 
      name: self.name, 
      document_id: document.id,
      user_id: user_id,
      leaf_id: leaf.id,
      content: content,
      shared: false,
      submitted: false      
    })
    
    transcription.save!
    position 
  end
    
end