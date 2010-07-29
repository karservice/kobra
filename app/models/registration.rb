class Registration < ActiveRecord::Base
  belongs_to :event
  belongs_to :visitor
  belongs_to :registration_batch
end
