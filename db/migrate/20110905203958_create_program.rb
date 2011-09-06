class CreateProgram < ActiveRecord::Migration
  def self.up
    create_table :programs, :id => false do |t|
      t.string :liu_id
      t.string :code
    end
  end

  def self.down
    drop_table :programs
  end
end