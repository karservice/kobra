class AddActivateExtraDiscountAtToTicketType < ActiveRecord::Migration
  def self.up
    add_column :ticket_types, :enable_extra_discount_at, :datetime
    add_column :ticket_types, :disable_extra_discount_at, :datetime
    add_column :ticket_types, :use_time_to_enable_extra_discount, :boolean
  end

  def self.down
    remove_column :ticket_types, :disable_extra_discount_at
    remove_column :ticket_types, :enable_extra_discount_at
    remove_column :ticket_types, :use_time_to_enable_extra_discount
  end
end
