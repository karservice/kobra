class AddNollanToVisitor < ActiveRecord::Migration
  def self.up
    add_column :visitors, :nollan, :boolean
    add_column :visitors, :sober, :boolean
  end

  def self.down
    remove_column :visitors, :nollan
    remove_column :visitors, :sober
  end
end
