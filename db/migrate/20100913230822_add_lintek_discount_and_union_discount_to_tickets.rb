class AddLintekDiscountAndUnionDiscountToTickets < ActiveRecord::Migration
  def self.up
    add_column :tickets, :lintek_discount, :boolean
    add_column :tickets, :union_discount, :boolean
  end

  def self.down
    remove_column :tickets, :union_discount
    remove_column :tickets, :lintek_discount
  end
end
