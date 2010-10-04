class ChangeUnionDiscountInTickets < ActiveRecord::Migration
  def self.up
    change_table :tickets do |t|
      t.boolean :union_override
      t.change :union_discount, :string
    end
  end

  def self.down
    change_table :tickets do |t|
      t.remove :union_override
      t.change :union_discount, :boolean
    end
  end
end
