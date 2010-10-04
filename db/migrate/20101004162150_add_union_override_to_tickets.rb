class AddUnionOverrideToTickets < ActiveRecord::Migration
  def self.up
    remove_column :visitors, :union_override
  end

  def self.down
    add_column :visitors, :union_override, :string
  end
end
