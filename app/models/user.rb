class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
         
 has_many :memberships
  
  def display_name
    "#{first_name} #{last_name} (#{username})"
  end

  def admin?
   true
  end

  def enabled?
   true
  end
end
