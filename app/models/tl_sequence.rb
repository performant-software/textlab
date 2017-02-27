 # NOTE: This class is only used for migrating data from the previous version of TextLab

class TlSequence < ActiveRecord::Base  

	def import_sequence!(document)
		owner = User.find_by( username: self.ownedby )

		# no owner, we outta here
		return if owner.nil?

		sequence = Sequence.new({ 
			name: self.name,
			document_id: document.id,
			shared: !self.sharedon.nil?,
			published: !self.publishedon.nil?,
			submitted: false,
			user_id: owner.id
		})
		sequence.save!  

		#  now parse the narrative steps from the sequence xml
		xml_document  = Nokogiri::XML(self.sequencexml)
		step_nodes = xml_document.root.children
		i = 0

		step_nodes.each { |step_node|
			narrative_step = NarrativeStep.new( { sequence_id: sequence.id })
			fields = step_node.children
			fields.each { |field|
				if field.name == 'num'
					narrative_step.step_number = i
				elsif field.name == 'sitename'
					# work out which zone this is referencing
					sitename = field.content
					unless sitename.blank?
						xml_id = parse_xml_id(sitename)
						zone_label = parse_zone_label(sitename)
						leaf = document.leafs.find_by( xml_id: xml_id )
						unless leaf.nil?
							zone = leaf.zones.find_by( zone_label: zone_label )
							unless zone.nil?
								narrative_step.zone_id = zone.id
								# this also tells us which leaf we are on if we don't already know
								sequence.leaf_id = leaf.id if sequence.leaf_id.nil?
							end
						end
					end
				elsif field.name == 'tei'
					narrative_step.step = field.content
				elsif field.name == 'narration' 
					narrative_step.narrative = field.content
				end
			}
			narrative_step.save!
			i = i + 1
		}

		# we added the leaf_id
		sequence.save!
  	end

  	private 

  	def parse_xml_id( sitename )
  		# sitename format: img_7-0026
  		regex = /^(.*)-/
    	match_xml_id = sitename.match(regex)
		match_xml_id.nil? ? nil : match_xml_id[1]
	end

	def parse_zone_label( sitename )
  		# sitename format: img_7-0026
  		regex = /-(.*)$/
    	match_xml_id = sitename.match(regex)
		match_xml_id.nil? ? nil : match_xml_id[1]
	end

end


# Sequence XML format
#  
# <sequence>
# 	<step>
# 		<num>1</num>
# 		<site>772DFA0E-F4BF-48BA-AB33-2E94ACA0E640</site>
# 		<sitename>img_7-0026</sitename>
# 		<tei><![CDATA[That signal object was the "Handsome Sailor" of the picturesque less prosaic <hi rend="bold">time</hi> of the military and merchant navies.]]></tei>
# 		<narration><![CDATA[Curiously, "time" appears to be capitalized in the manuscript, yet it is difficult to discern definitively. Nevertheless, editors ensured that "time" was lower-cased for publication. However, if Melville intended for "time" to be capitalized, this would suggest that Billy's enchanting arrival on the docks (and unfortunate subsequent tragedy) was a significant event in maritime history. Readers may speculate that Melville expected Billy's story to become an integral part of literary history, which could be a motivating factor in his capitalizing "time," if his actual objectives could be determined.]]></narration>
# 	</step>
# </sequence>