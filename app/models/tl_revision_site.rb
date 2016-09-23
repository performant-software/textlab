# NOTE: This class is only used for migrating data from the previous version of TextLab

class TlRevisionSite < ActiveRecord::Base
  
  def import_zone!( leaf, scale_factor )    
    
    # format: 465,589,465,589,465,589,465,589,465,589
    datum = self.polygon.split(',')
    
    # group into ul and lr
    # scale based on scaling factor for this image
    ulx = datum[0] * scale_factor
    uly = datum[1] * scale_factor
    lrx = datum[8] * scale_factor
    lry = datum[9] * scale_factor
    
    zone = Zone.new( { 
      leaf_id: leaf.id, 
      zone_label: self.sitenum,
      ulx: ulx,
      uly: uly,
      lrx: lrx,
      lry: lry
    })
    
    zone.save!
  end
  

end