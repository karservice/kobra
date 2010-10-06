# -*- encoding : utf-8 -*-
class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable, :lockable and :timeoutable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me, :admin

  # Both email and username must be unique, since both can be used as a login key
  validates_presence_of :email, :on => :create, :message => "måste anges"
  validates_presence_of :username, :on => :create, :message => "måste anges"
  validates_uniqueness_of :email, :on => :create, :message => "måste vara unikt"
  validates_uniqueness_of :username, :on => :create, :message => "måste vara unikt"

  has_and_belongs_to_many :events

  # Override method to allow both usernam and email login
  def self.find_for_database_authentication(conditions)
    value = conditions[authentication_keys.first]
    where(["username = :value OR email = :value", { :value => value }]).first
  end

  def to_s
    self.email
  end
end
