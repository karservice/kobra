class CreateTicketTypes < ActiveRecord::Migration
  def self.up
    create_table :ticket_types do |t|
      t.string :name
      t.string :description
      t.integer :price
      t.integer :union_discount
      t.integer :maximum_number_of_tickets
      t.integer :event_id

      t.timestamps
    end
  end

  def self.down
    drop_table :ticket_types
  end
end
