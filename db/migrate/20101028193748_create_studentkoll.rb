class CreateStudentkoll < ActiveRecord::Migration
  def self.up
    # Like LiUs Oracle database
    create_table :studentkoll, :id => false do |t|
      t.string :epost
      t.string :fornamn
      t.string :efternamn
      t.string :pnr_format
      t.string :rfidnr
      t.string :streckkodnr
      t.datetime :giltig_till
      t.string :kar
      t.string :blockerat
    end
  end

  def self.down
    drop_table :studentkoll
  end
end
