class CreateEqFeatures < ActiveRecord::Migration[7.1]
  def change
    create_table :eq_features do |t|
      t.string :feature_id
      t.decimal :mag
      t.string :place
      t.integer :time
      t.string :url
      t.integer :tsunami
      t.string :magType
      t.string :title
      t.decimal :longitude
      t.decimal :latitude
      t.text :comments

      t.timestamps
    end
  end
end
