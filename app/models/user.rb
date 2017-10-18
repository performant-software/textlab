class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  usernname_regex = /\A[0-9a-z]{3,}\z/i

  validates :username, :presence => true,
                       :format   => { :with => usernname_regex, :message => "must be alphanumeric with no spaces." },
                       :uniqueness => true
         
 has_many :memberships
 belongs_to :site
  
  def display_name
    "#{first_name} #{last_name} (#{username})"
  end

  def attribution_name
    "#{first_name} #{last_name}"
  end

  def admin?
   self.user_type == 'admin'
  end

  def enabled?
   true
  end

  def self.get_all( current_user )
    if current_user.user_type == 'admin'
      users = User.all.map 
    else
      users = current_user.site.users
    end

    user_objs = users.map { |user| user.obj }
    user_objs.sort { |x,y| x[:full_name].downcase <=> y[:full_name].downcase }
  end

  def obj
    {
      id: self.id,
      username: self.username,
      full_name: "#{self.last_name}, #{self.first_name}",
      first_name: self.first_name,
      last_name: self.last_name,
      site_id: self.site.nil? ? nil : self.site.id,
      site_name: self.site.nil? ? '' : self.site.name,
      email: self.email,
      user_type: self.user_type
    }
  end
end
