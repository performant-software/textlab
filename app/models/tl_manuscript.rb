# NOTE: This class is only used for migrating data from the previous version of TextLab

class TlManuscript < ActiveRecord::Base  

	def self.import_manuscripts!
		TlManuscript.all.each { |tl_manuscript|
			tl_manuscript.import_manuscript!
		}
	end

	def import_manuscript( tl_manuscript )

		# note: this fn assumes document is empty to start
		manuscript_guid = tl_manuscript.id
		root_node = self.root_node
		position = 0

		owner = User.find_by( username: tl_manuscript.userid )

		document = Document.new({
			name: tl_manuscript.name,
			user: owner
		})

		document.save!

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
		  folder.tl_transcriptions.where( ownedby: 'admin' ).order(:name).each { |transcription|
		    leaf_position = transcription.import_leaves!( node, document, leaf_position, manuscript_guid )
		  }
		}

		# import the transcriptions that aren't in folders
		TlTranscription.where({ tl_folder_id: nil, manuscriptid: manuscript_guid, ownedby: 'admin' }).order(:name).each { |transcription|
		  position = transcription.import_leaves!( root_node, document, position, manuscript_guid )
		}
    
  end


end