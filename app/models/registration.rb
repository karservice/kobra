# -*- encoding : utf-8 -*-
class Registration < ActiveRecord::Base
  belongs_to :event
  belongs_to :visitor
  belongs_to :registration_batch
  has_many :tickets, :dependent => :destroy # FIXME registration should never be deleted
  
  validates_presence_of :event, :on => :create, :message => "can't be blank"
  validates_presence_of :visitor, :on => :create, :message => "can't be blank"
  validates_associated :event, :on => :create
  validates_associated :visitor, :on => :create
end
