class AddCreatedByToTickets < ActiveRecord::Migration
  def self.up
    add_column :tickets, :created_by, :integer
  end

  def self.down
    remove_column :tickets, :created_by
  end
end
