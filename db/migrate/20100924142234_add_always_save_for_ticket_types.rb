class AddAlwaysSaveForTicketTypes < ActiveRecord::Migration
  def self.up
    add_column :ticket_types, :always_save, :boolean
  end

  def self.down
    remove_column :ticket_types, :always_save
  end
end
