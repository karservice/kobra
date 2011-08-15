class AddUnionLimitToTicketType < ActiveRecord::Migration
  def self.up
    add_column :ticket_types, :available_for_union, :string
  end

  def self.down
    remove_column :ticket_types, :available_for_union
  end
end
