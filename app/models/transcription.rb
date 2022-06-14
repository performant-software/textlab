class Transcription < ActiveRecord::Base

  include EditingPermissions

  belongs_to :document
  belongs_to :user
  belongs_to :leaf
  has_one :diplo, dependent: :destroy
  has_many :zones, dependent: :destroy
  has_many :sequences, dependent: :destroy

  # TODO if publish setting is changed, make sure all others are unpublished

  # tells editing permissions which fields contain writable content
  def content_fields
    [ :name, :content, :next_zone_label ]
  end

  def copy(attrs)
    copy = self.dup
    copy.update_attributes(attrs)

    self.zones.each do |zone|
      copy.zones << zone.dup
    end

    copy
  end

  def zones_hash
    fragment = Nokogiri::XML.fragment(self.content)
    zones_hash = {}
    %w(metamark add del subst restore).each do |attrs|
      fragment.xpath("//#{attrs}").each do |mark|
        next unless mark.attributes["facs"].present?
        zone = mark.attributes["facs"].value.split("-").last
        unless zones_hash.keys.include?(zone)
          temp_hash = {
            tei: attrs
          }
          %w(place function rend change facs hand).each do |attr|
            if mark.attributes.keys.include?(attr)
              temp_hash[attr] = mark.attributes[attr].value
            end
          end
          zones_hash[zone] = temp_hash
        end
      end
    end
    zones_hash
  end

  def stages_hash(stages)
    new_hash = {}
    zones = self.zones_hash
    zones.keys.each do |zone|
      stages.each do |stage|
        if zones[zone]["change"].present? && zones[zone]["change"] == stage
          new_hash[zone] = zones[zone]
        end
      end
    end
    new_hash
  end


  def obj(current_user_id=nil)

    owner = ( current_user_id == self.user_id )

    {
      id: self.id,
      name: self.name,
      content: self.content,
      shared: self.shared,
      submitted: self.submitted,
      published: self.published,
      next_zone_label: self.next_zone_label,
      owner: owner,
      owner_name: self.user&.display_name,
      zone_hash: zones_hash,
      zones: self.zones.map{ |z| z.obj },
      xml_id: self.leaf.xml_id
    }
  end

  def published_sequence_objs
    seqs = self.sequences.where( published: true )
    seqs.map { |s| s.list_obj }
  end

end
