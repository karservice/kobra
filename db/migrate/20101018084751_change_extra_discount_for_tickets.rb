class ChangeExtraDiscountForTickets < ActiveRecord::Migration
  def self.up
    rename_column :tickets, :lintek_discount, :extra_discount
  end

  def self.down
    rename_column :tickets, :extra_discount, :lintek_discount
  end
end
