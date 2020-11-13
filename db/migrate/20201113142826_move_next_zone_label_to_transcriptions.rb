class MoveNextZoneLabelToTranscriptions < ActiveRecord::Migration
  def change
    add_column :transcriptions, :next_zone_label, :integer, null: false, default: 1

    execute <<-SQL.squish
      UPDATE transcriptions
         SET next_zone_label = leafs.next_zone_label
        FROM leafs
       WHERE transcriptions.leaf_id = leafs.id
    SQL

    remove_column :leafs, :next_zone_label
  end
end
