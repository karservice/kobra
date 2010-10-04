class AddPermanentToEvents < ActiveRecord::Migration
  def self.up
    add_column :events, :permanent, :boolean
  end

  def self.down
    remove_column :events, :permanent
  end
end
