class ChangeExtraDiscountForTicketTypes < ActiveRecord::Migration
  def self.up
    rename_column :ticket_types, :lintek_discount, :extra_discount
    rename_column :ticket_types, :number_of_lintek_discount_tickets, :number_of_extra_discount_tickets
    rename_column :ticket_types, :lintek_discount_count, :extra_discount_count
    add_column :ticket_types, :extra_discount_for_union, :string
  end

  def self.down
    rename_column :ticket_types, :extra_discount, :lintek_discount
    rename_column :ticket_types, :number_of_extra_discount_tickets, :number_of_lintek_discount_tickets
    rename_column :ticket_types, :extra_discount_count, :lintek_discount_count
    remove_column :ticket_types, :extra_discount_for_union
  end
end
