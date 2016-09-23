class AddLeafXmlId < ActiveRecord::Migration
  def change
    add_column :leafs, :xml_id, :string
  end
end
