class Transcription < ActiveRecord::Base

  include EditingPermissions

  belongs_to :document
  belongs_to :user
  belongs_to :leaf
  has_one :diplo, dependent: :destroy

  # TODO if publish setting is changed, make sure all others are unpublished

  # tells editing permissions which fields contain writable content
  def content_fields
    [ :name, :content ]
  end

  def zones_hash
    fragment = Nokogiri::XML.fragment(self.content)
    zones_hash = {}
    %w(metamark add del subst restore).each do |attrs|
      fragment.xpath("//#{attrs}").each do |mark|
        zone = mark.attributes["facs"].value.split("-").last
        unless zones_hash.keys.include?(zone)
          temp_hash = {}
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
      owner: owner,
      owner_name: self.user.display_name,
      zone_hash: zones_hash
    }
  end

end
