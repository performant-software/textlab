class DocumentSection < ActiveRecord::Base
  
  belongs_to :document  
  has_one :document_node, dependent: :destroy
  
  def obj    
    { 
      id: self.id,
      name: self.name
    }
  end
  
end