# NOTE: This class is only used for migrating data from the previous version of TextLab

class TlManuscript < ActiveRecord::Base  

	def self.import_manuscripts!
		TlManuscript.all.each { |tl_manuscript|
			tl_manuscript.import_manuscript!
		}
	end

	def import_manuscript!

		# note: this fn assumes document is empty to start
		manuscript_guid = self.id

		owner = User.find_by( username: self.userid )

		document = Document.new({
			name: self.name,
			user: owner
		})

		document.save!

		# create a single leaf to collect all the homeless transcriptions
		blank_leaf = Leaf.new
		blank_leaf.document = document
		blank_leaf.name = 'transcriptions with no leaf'
		blank_leaf.save!

		root_node = document.root_node
		position = 0

		# create all folders and their contents
		TlFolder.where({ manuscript_id: manuscript_guid }).order(:name).each { |folder|
			section = DocumentSection.new
			section.document = document
			section.name = folder.name
			section.save!

			node = DocumentNode.new
			node.document = document
			node.position = position
			node.document_node_id = root_node.id
			node.document_section = section
			node.save!
			position = position + 1

			leaf_position = 0
			folder.tl_transcriptions.order(:name).each { |transcription|
				leaf_position = transcription.import_leaves!( node, document, leaf_position, manuscript_guid, blank_leaf )
			}
		}

		# import the transcriptions that aren't in folders
		TlTranscription.where({ tl_folder_id: nil, manuscriptid: manuscript_guid }).order(:name).each { |transcription|
		  position = transcription.import_leaves!( root_node, document, position, manuscript_guid, blank_leaf )
		}

		# make a node for the blank leaf at the bottom of the list
       	document_node = DocumentNode.new
        document_node.document_node_id = root_node.id
        document_node.document = document
        document_node.position = position
        document_node.leaf = blank_leaf
        document_node.save!    
    
  end


end