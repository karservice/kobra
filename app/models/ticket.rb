# -*- encoding : utf-8 -*-
class Ticket < ActiveRecord::Base
  belongs_to :ticket_type
  belongs_to :registration
  has_one :visitor, :through => :registration

  validates_presence_of :ticket_type, :on => :create, :message => "can't be blank"
  validates_presence_of :registration, :on => :create, :message => "can't be blank"
  validates_associated :ticket_type, :on => :create
  validates_associated :registration, :on => :create

  validate :validate_maximum_number_of_tickets, :on => :create

  scope :any_union, where('union_discount IS NOT ?', nil)
  scope :union, lambda { |union_name|
      where('lintek_discount LIKE ?', true) if union_name.to_s.downcase == "lintek"
      # Should be something like this
      #where('union_discount LIKE ?', union_name.to_s)
  }

  def validate_maximum_number_of_tickets
    # maximum_number_of_tickets == 0 means infinit
    if (self.ticket_type.maximum_number_of_tickets.to_i != 0) && (self.ticket_type.tickets.count >= self.ticket_type.maximum_number_of_tickets.to_i)
      self.errors.add(:base, "Biljetter slut")
    end
  end

  before_create {|ticket|
    if self.should_have_lintek_discount?
      ticket.lintek_discount = true
    end

    # Save the union
    if self.should_have_union_discount?
      ticket.union_discount = true
    end
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

  def should_have_union_discount?
    self.registration.visitor.union_member?
  end

  def should_have_lintek_discount?
    self.registration.visitor.union == "LinTek" &&
      self.ticket_type.number_of_lintek_discount_tickets.to_i > self.ticket_type.number_of_lintek_discounts
  end

  def price
    amount = self.ticket_type.price.to_i
    if self.union_discount?
      amount = amount - self.ticket_type.union_discount.to_i
      if self.lintek_discount?
        amount = amount - self.ticket_type.lintek_discount.to_i
      end
    end
    amount
  end
end
