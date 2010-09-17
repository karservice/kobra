class ChangeUnionOverrideToStringInVisitors < ActiveRecord::Migration
  def self.up
    change_column :visitors, :union_override, :string
  end

  def self.down
    change_column :visitors, :union_override, :boolean
  end
end
