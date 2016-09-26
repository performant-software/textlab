# NOTE: This class is only used for migrating data from the previous version of TextLab

class TlRevisionSite < ActiveRecord::Base
  
  def import_zone!( leaf, x_scale, y_scale )    
    
    # format: 465,589,465,589,465,589,465,589,465,589
    datum = self.polygon.split(',')
    
    # group into ul and lr
    # scale based on scaling factor for this image
    ulx = (datum[0].to_f * x_scale).to_i
    uly = (datum[1].to_f * y_scale).to_i
    lrx = (datum[4].to_f * x_scale).to_i
    lry = (datum[5].to_f * y_scale).to_i
    
    zone = Zone.new( { 
      leaf_id: leaf.id, 
      zone_label: self.zone_label,
      ulx: ulx,
      uly: uly,
      lrx: lrx,
      lry: lry
    })
    
    zone.save!
  end
  
  def zone_label
    zeros = "";
    zeros = zeros + "0" if self.sitenum < 10 
    zeros = zeros + "0" if self.sitenum < 100 
    zeros = zeros + "0" if self.sitenum < 1000
    "#{zeros}#{self.sitenum}"
  end
  
end