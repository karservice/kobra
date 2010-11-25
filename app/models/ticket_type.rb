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

  # True if there's discount tickets
  def extra_discount_enabled?
    # If time setting is enabled, check everything
    if self.use_time_to_enable_extra_discount?
      self.enable_extra_discount_at <= Time.now &&
      self.disable_extra_discount_at >= Time.now &&
      self.extra_discount_tickets_left?
    else
      # Otherwise just check if there's tickets left
      self.extra_discount_tickets_left?
    end
  end

  def extra_discount_tickets_left?
    self.number_of_extra_discount_tickets.to_i == 0 ||
      self.number_of_extra_discount_tickets.to_i > self.number_of_extra_discounts
  end

  def number_of_extra_discounts
    self.tickets.where(:extra_discount => true).count
  end

  def number_of_union_discounts
    self.tickets.where("union_discount NOT LIKE ?", false).count
  end
end
