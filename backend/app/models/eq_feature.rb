class EqFeature < ApplicationRecord
    validates_presence_of :title , :url, :magType, :place, :longitude, :latitude
    validates_numericality_of :longitude, on: :create
    validates_numericality_of :latitude, on: :create
    validates :feature_id, presence: true, uniqueness: true
end
