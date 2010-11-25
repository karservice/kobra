# -*- encoding : utf-8 -*-
class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable, :lockable and :timeoutable
  devise :database_authenticatable, :recoverable, :rememberable,
    :trackable, :validatable, :token_authenticatable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me, :admin, :username

  # Both email and username must be unique, since both can be used as a login key
  validates_presence_of :email, :on => :create, :message => "måste anges"
  validates_presence_of :username, :on => :create, :message => "måste anges"
  validates_uniqueness_of :email, :on => :create, :message => "måste vara unikt"
  validates_uniqueness_of :username, :on => :create, :message => "måste vara unikt"

  has_and_belongs_to_many :events

  # Override Devise method to allow both usernam and email login
  def self.find_for_database_authentication(conditions)
    value = conditions[authentication_keys.first]
    where(["username = :value OR email = :value", { :value => value }]).first
  end

  # Verify id and api_key
  def self.verify_api_key(id, api_key)
    User.where(:username => id, :api_key => api_key).first
  end

  def to_s
    self.name
  end

  def name
    self.username || self.email
  end

  def default_event
    if self.events.size == 1
      self.events.first
    end
  end

  def save_and_send_password_instructions
    self.generate_reset_password_token
    if status = self.save
      UserMailer.welcome_instructions(self).deliver
    end
    # Return save status
    status
  end

  protected

  # Override password_required? Since we don't need password for new users
  # with recover tokens
  #
  # Checks whether a password is needed or not. For validations only.
  # Passwords are always required if it's a new record, or if the password
  # or confirmation are being set somewhere.
  def password_required?
    if reset_password_token?
      false
    else
      !persisted? || !password.nil? || !password_confirmation.nil?
    end
  end

end
