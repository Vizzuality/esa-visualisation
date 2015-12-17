class CreatePages < ActiveRecord::Migration
  def change
    create_table :pages do |t|
      t.string :title, null: false
      t.text :body
      t.integer :page_type, default: 1

      t.timestamps null: false
    end
  end
end
