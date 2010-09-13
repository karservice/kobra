class AddElectronicTicketsToEvents < ActiveRecord::Migration
  def self.up
    add_column :events, :electronic_tickets, :boolean
  end

  def self.down
    remove_column :events, :electronic_tickets
  end
end
