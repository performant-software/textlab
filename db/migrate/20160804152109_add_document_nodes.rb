class AddDocumentNodes < ActiveRecord::Migration
  def change
    create_table :document_nodes do |t|
      t.integer :position
      t.integer :document_node_id
      t.integer :document_id
      t.integer :leaf_id
      t.integer :section_id
      t.timestamps null: false
    end
  end
end
