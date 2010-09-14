class AddUnionOverrideToVisitor < ActiveRecord::Migration
  def self.up
    add_column :visitors, :union_override, :boolean
  end

  def self.down
    remove_column :visitors, :union_override
  end
end
