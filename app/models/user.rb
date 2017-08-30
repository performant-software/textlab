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
  
  def display_name
    "#{first_name} #{last_name} (#{username})"
  end

  def attribution_name
    "#{first_name} #{last_name}"
  end

  def admin?
   true
  end

  def enabled?
   true
  end
end
