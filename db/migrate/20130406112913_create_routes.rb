class CreateRoutes < ActiveRecord::Migration
  def change
    create_table :routes do |t|
      t.integer :user_id
      t.string  :email
      t.integer :forward_count, :default => 0
      t.boolean :enabled, :default => 0

      t.timestamps
    end

    add_index :routes, [:user_id, :email]
  end
end
