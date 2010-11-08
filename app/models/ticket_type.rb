# -*- encoding : utf-8 -*-
class TicketType < ActiveRecord::Base
  belongs_to :event
  has_many :tickets

  validates_presence_of :event, :on => :create, :message => "can't be blank"
  validates_associated :event, :on => :create

  # FIXME Could probably be improved
  before_destroy { |t| raise "Not safe for deletion!" unless t.safe_for_deletion? }

  def safe_for_deletion?
    self.tickets.empty?
  end

  def to_s
    self.name
  end

  def available?
    (self.maximum_number_of_tickets.to_i == 0) || (self.tickets.count < self.maximum_number_of_tickets.to_i)
  end

  def extra_discount_enabled?
    self.enable_extra_discount_at <= Time.now && self.disable_extra_discount_at >= Time.now
  end

  def number_of_extra_discounts
    self.tickets.where(:extra_discount => true).count
  end

  def number_of_union_discounts
    self.tickets.where("union_discount NOT LIKE ?", false).count
  end
end
