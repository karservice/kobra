# -*- encoding : utf-8 -*-
class Ticket < ActiveRecord::Base
  belongs_to :ticket_type
  belongs_to :registration
  has_one :visitor, :through => :registration
  belongs_to :seller, :foreign_key => "created_by", :class_name => "User"

  validates_presence_of :ticket_type, :on => :create, :message => "can't be blank"
  validates_presence_of :registration, :on => :create, :message => "can't be blank"
  validates_associated :ticket_type, :on => :create
  validates_associated :registration, :on => :create

  validate :validate_maximum_number_of_tickets, :on => :create

  scope :any_union, where('union_discount IS NOT ?', nil)
  scope :union, lambda {|u| where('union_discount LIKE ?', u.to_s) }

  def validate_maximum_number_of_tickets
    # maximum_number_of_tickets == 0 means infinit
    if (self.ticket_type.maximum_number_of_tickets.to_i != 0) && (self.ticket_type.tickets.count >= self.ticket_type.maximum_number_of_tickets.to_i)
      self.errors.add(:base, "Biljetter slut")
    end
  end

  # Save ticket union, unless union_override. Then it has already been done
  before_create {|ticket|
    unless ticket.union_override
      ticket.union_discount = self.registration.visitor.union
    end

    # Note if its an extra discount
    ticket.extra_discount = self.ticket_type.extra_discount_enabled? && ticket.union_discount == self.ticket_type.extra_discount_for_union &&
      (self.ticket_type.number_of_extra_discount_tickets.to_i == 0 || self.ticket_type.number_of_extra_discount_tickets.to_i > self.ticket_type.number_of_extra_discounts)

    # Return true, we don't want to stop the creation
    true
  }

  def handout!
    self.update_attribute(:handed_out_at, Time.now)
  end

  def handed_out?
    self.handed_out_at
  end

  def to_s
    self.ticket_type.to_s
  end

  def price
    amount = self.ticket_type.price.to_i
    if self.union_discount?
      amount = amount - self.ticket_type.union_discount.to_i
      if self.extra_discount?
        amount = amount - self.ticket_type.extra_discount.to_i
      end
    end
    amount
  end
end
