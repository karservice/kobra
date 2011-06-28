class ChangeStudents < ActiveRecord::Migration
  def up
    change_table(:students) do |t|
      t.remove :union_member
      t.string :union
      t.datetime :union_expire_at
    end
  end

  def down
    change_table(:students) do |t|
      t.boolean :union_member
      t.remove :union
      t.remove :union_expire_at
    end
  end
end
