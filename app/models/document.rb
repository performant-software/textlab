class Document < ActiveRecord::Base
      	
  has_many :leafs, dependent: :destroy
        
  def self.get_all()
		documents = Document.all
		documents.map { |document| document.list_obj }
	end  
  
  after_create do |document|
    # create starting leaf.
    first_leaf = Leaf.new
    first_leaf.tile_source = Leaf.test_source
    first_leaf.document = self
    first_leaf.save
  end
  
  def list_obj
    { 
      id: self.id,
      name: self.name
    }
  end
  
  def obj
    leafsJSON = self.leafs.map { |leaf| leaf.obj }
    
    { 
      id: self.id,
      name: self.name,
      leafs: leafsJSON
    }
  end
  
end