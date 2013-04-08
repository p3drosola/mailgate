class CreateAuthTokens < ActiveRecord::Migration
  def change
    create_table :auth_tokens do |t|
      t.integer :user_id
      t.string :token
      t.boolean :activated, :default => 0

      t.timestamps
    end

    add_index :auth_tokens, :token
  end
end
