class Zone < ActiveRecord::Base
  
  belongs_to :leaf
    
  def obj
    { 
      id: self.id,
      zone_label: self.zone_label,
      ulx: self.ulx,
      uly: self.uly,
      lrx: self.lrx,
      lry: self.lry       
    }
  end
  
end