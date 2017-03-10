class CreateNarrativeStep < ActiveRecord::Migration
  def change
    create_table :narrative_steps do |t|
      	t.integer :sequence_id
		t.integer :zone_id
      	t.integer :step_number
      	t.text :step
      	t.text :narrative
    end
  end
end
