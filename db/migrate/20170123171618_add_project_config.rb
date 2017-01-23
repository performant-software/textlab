class AddProjectConfig < ActiveRecord::Migration
  def change
  	create_table :project_configs do |t|
  		t.string :name  
  		t.string :description  
		t.text :vocabs
		t.text :tags
    end
  end
end
