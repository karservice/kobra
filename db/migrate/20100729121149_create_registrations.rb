# -*- encoding : utf-8 -*-
class CreateRegistrations < ActiveRecord::Migration
  def self.up
    create_table :registrations do |t|
      t.integer :event_id
      t.integer :visitor_id
      t.integer :registration_batch_id
      t.string :note

      t.timestamps
    end
  end

  def self.down
    drop_table :registrations
  end
end
