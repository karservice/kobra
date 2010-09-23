# -*- encoding : utf-8 -*-
class CreateTickets < ActiveRecord::Migration
  def self.up
    create_table :tickets do |t|
      t.string :note
      t.integer :ticket_type_id
      t.integer :registration_id
      t.integer :handed_out_by
      t.datetime :handed_out_at
      t.string :handout_location
      t.datetime :emailed_at

      t.timestamps
    end
  end

  def self.down
    drop_table :tickets
  end
end
