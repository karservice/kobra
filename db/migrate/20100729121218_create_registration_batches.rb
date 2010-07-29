class CreateRegistrationBatches < ActiveRecord::Migration
  def self.up
    create_table :registration_batches do |t|
      t.string :note
      t.text :data
      t.integer :event_id

      t.timestamps
    end
  end

  def self.down
    drop_table :registration_batches
  end
end
