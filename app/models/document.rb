class Document < ActiveRecord::Base
      	
  def self.get_all()
		documents = Document.all
		documents.map { |document| document.list_obj }
	end  
  
  def list_obj
    { 
      id: self.id,
      name: self.name
    }
  end
  
  def obj
    { 
      id: self.id,
      name: self.name,
      content: self.content
    }
  end
  
end