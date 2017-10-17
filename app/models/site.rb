class Site < ActiveRecord::Base
      
  def self.get_all
    Site.all.order('name').map { |site| site.obj }
  end

  def obj
    { 
      id: self.id,
      name: name,
      max_accounts: self.max_accounts
    }
  end
  
end