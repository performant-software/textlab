class Leaf < ActiveRecord::Base

  has_many :zones, dependent: :destroy
  has_many :transcriptions, dependent: :destroy
  has_many :sequences, dependent: :destroy
  belongs_to :document
  has_one :document_node, dependent: :destroy

  def change_image_source_domain( target_domain, mel=false )
    return false if self.tile_source.nil? or self.tile_source == ""
    iiif_regex = /IIIF=(.*)/
    match = iiif_regex.match(self.tile_source)
    return false if match.nil?
    iiif_string = match[0]

    # TODO remove - special one time processing for mel..
    if mel
      mel_regex = /billy\/(.*)/
      filename = mel_regex.match(iiif_string)[1]
      iiif_string = "IIIF=mel/billybudd/#{filename}"
    end

    self.tile_source = "#{target_domain}/?#{iiif_string}"
    return true
  end

  def get_transcription_objs( user_id )
    project_owner = self.document.is_owner?(user_id)
    transcriptions = []
    self.transcriptions.each { |t|
      if user_id == t.user_id || t.shared || (t.submitted and project_owner)
        transcriptions << t.obj(user_id)
      end
    }
    transcriptions
  end

  def get_sequence_objs( user_id )
    project_owner = self.document.is_owner?(user_id)
    sequences = []
    self.sequences.each { |s|
      if user_id == s.user_id || s.shared || (s.submitted and project_owner)
        sequences << s.obj(user_id)
      end
    }
    sequences
  end

  def published_sequence_objs
    seqs = self.sequences.where( published: true )
    seqs.map { |s| s.list_obj }
  end

  def published_transcription
    self.transcriptions.find_by( published: true )
  end

  def create_node!( parent_node, position )
    document_node = DocumentNode.new()
    document_node.document_node_id = parent_node.id
    document_node.document = self.document
    document_node.position = position
    document_node.leaf = self
    document_node.save!
    position + 1
  end

  def secondary_enabled(current_user_id)
    # locate the transcription for this leaf that is published
    transcription = self.transcriptions.find_by(published: true)

    # if there is one, secondary is enabled if we are owner or it is shared
    !transcription.nil? && (transcription.shared || transcription.user_id == current_user_id)
  end

  def thumb_url
    # IIIF format {scheme}://{server}{/prefix}/{identifier}/{region}/{size}/{rotation}/{quality}.{format}
     "#{self.tile_source}/full/150,/0/default.jpg"
  end

  def medium_url
    "#{self.tile_source}/full/600,/0/default.jpg"
  end

  def export_obj
    # retrieve the published transcription
    transcription = self.transcriptions.where(published:true).first
    Diplo.create_diplo!( transcription ) unless transcription.nil? or transcription.diplo

    # if the diplo rendered correctly, get the base text
    if !transcription.nil? and transcription.diplo and !transcription.diplo.error
      base_text = transcription.diplo.base_text
      transcription_id = transcription.id
    else
      base_text = ""
      transcription_id = ""
    end

    {
      id: self.id,
      image_url: self.tile_source,
      transcription_id: transcription_id,
      base_text: base_text
    }
  end

  def obj(current_user_id)
    zonesJSON = self.zones.map { |zone| zone.obj }
    {
      id: self.id,
      name: self.name,
      document_id: self.document_id,
      xml_id: self.xml_id,
      tile_source: self.tile_source&.gsub('/full/full/0/default.jpg',''),
      next_zone_label: self.next_zone_label,
      secondary_enabled: secondary_enabled(current_user_id),
      zones: zonesJSON
    }
  end

end
