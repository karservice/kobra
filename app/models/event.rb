# -*- encoding : utf-8 -*-
class Event < ActiveRecord::Base
  has_many :registrations
  has_many :visitors, :through => :registrations
  has_many :registration_batches
  has_many :ticket_types
  has_many :tickets, :through => :registrations
  
  def to_s
    self.title
  end
  
  def available_ticket_types
    self.ticket_types.select {|t| t.available? }
  end
  
end
