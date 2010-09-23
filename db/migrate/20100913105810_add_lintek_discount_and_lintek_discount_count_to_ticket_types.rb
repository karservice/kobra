# -*- encoding : utf-8 -*-
class AddLintekDiscountAndLintekDiscountCountToTicketTypes < ActiveRecord::Migration
  def self.up
    add_column :ticket_types, :number_of_lintek_discount_tickets, :integer
    add_column :ticket_types, :lintek_discount_count, :integer
    add_column :ticket_types, :lintek_discount, :integer
  end

  def self.down
    remove_column :ticket_types, :number_of_lintek_discount_tickets, :integer
    remove_column :ticket_types, :lintek_discount
    remove_column :ticket_types, :lintek_discount_count
  end
end
