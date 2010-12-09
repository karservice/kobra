class GenerateApiKeys < ActiveRecord::Migration
  def self.up
    say "Adding API key to users"
    User.where(:api_key => nil).each do |user|
      user.update_attribute(:api_key, SecureRandom.hex(10))
    end
  end

  def self.down
    # Nothing to do ...
  end
end
