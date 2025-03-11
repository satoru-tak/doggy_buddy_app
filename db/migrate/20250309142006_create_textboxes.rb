class CreateTextboxes < ActiveRecord::Migration[8.0]
  def change
    create_table :textboxes do |t|
      t.text :content

      t.timestamps
    end
  end
end
