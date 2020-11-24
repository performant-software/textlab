class AddTranscriptionIdToSequences < ActiveRecord::Migration
  def change
    # Add the transcription_id column
    add_reference :sequences, :transcription, index: true, foreign_key: true

    # Update all sequences to link to the first transcription
    execute <<-SQL.squish
      WITH first_transcriptions AS (
        SELECT a.id, a.leaf_id
          FROM transcriptions a
          LEFT JOIN transcriptions b ON b.leaf_id = a.leaf_id
                                    AND b.created_at < a.created_at
         WHERE b.id IS NULL
      )
      UPDATE sequences s
         SET transcription_id = ft.id
        FROM first_transcriptions ft
       WHERE ft.leaf_id = s.leaf_id
    SQL

    # Remove the leaf_id column
    remove_reference :sequences, :leaf
  end
end
