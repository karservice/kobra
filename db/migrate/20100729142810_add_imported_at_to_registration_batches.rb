# -*- encoding : utf-8 -*-
class AddImportedAtToRegistrationBatches < ActiveRecord::Migration
  def self.up
    add_column :registration_batches, :imported_at, :datetime
  end

  def self.down
    remove_column :registration_batches, :imported_at
  end
end
