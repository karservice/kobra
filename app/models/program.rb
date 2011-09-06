class Program < ActiveRecord::Base
  def self.for(liu_id)
    entry = self.where(:liu_id => liu_id).first
    entry.code if entry
  end
end