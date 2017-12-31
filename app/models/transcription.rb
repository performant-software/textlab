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
      owner_name: self.user.display_name
    }
  end

end
