# NOTE: This class is only used for migrating data from the previous version of TextLab

class TlLeaf < ActiveRecord::Base
  
  def self.find_orphans( document_id, manuscript_guid )
	found_leaf_ids = Leaf.where( document_id: document_id ).map { |leaf| leaf.xml_id }

	TlLeaf.where( manuscriptid: manuscript_guid ).order(:name).each { |tl_leaf|
		unless found_leaf_ids.include? tl_leaf.name
			puts tl_leaf.name
		end
	}

	nil
  end

end