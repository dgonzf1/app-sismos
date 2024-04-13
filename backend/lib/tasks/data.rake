
MIN_MAGNITUDE = -1.0
MAX_MAGNITUDE = 10.0
MAX_LATITUDE = 90.0
MIN_LATITUDE = -90.0
MIN_LONGITUDE = -180.0
MAX_LONGITUDE = 180.0
ENDPOINT = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

namespace :data do
  desc "Fill the database with data from earthquakes from the last 30 days."
  task fill_database: :environment do

    def filter_feature(feature)
      # Check if any required field is nill
      properties = feature["properties"]

      # Obtain longitude, latitude and magnitude.
      long = feature["geometry"]["coordinates"][0]
      lat = feature["geometry"]["coordinates"][1]
      mag = properties["mag"]

      validate_existence = [ properties["title"], properties["url"], properties["magType"], properties["place"], mag, long, lat]
      if !validate_existence.any?
        return false
      end

      
      if (long > MAX_LONGITUDE or long < MIN_LONGITUDE or \
        lat < MIN_LATITUDE or lat > MAX_LATITUDE or \
        mag < MIN_MAGNITUDE or mag > MAX_MAGNITUDE )
        return false
      end
      return true
    end

    begin
      response = HTTParty.get(ENDPOINT)

      # Check for successful response (2xx code)
      if response.success?
        # Parse the response (assuming JSON format)
        json_response = response.parsed_response
        features = json_response["features"]
        features.select!{|feature| filter_feature(feature) }

        # Map all the filtered elements to add them to the database.
        eq_features = features.map do |feature| 
          
          {
            feature_id: feature["id"],
            title: feature["properties"]["title"],
            url: feature["properties"]["url"],
            magType: feature["properties"]["magType"],
            longitude: feature["geometry"]["coordinates"][0],
            latitude: feature["geometry"]["coordinates"][1],
            time: feature["properties"]["time"],
            place: feature["properties"]["place"],
            mag: feature["properties"]["mag"],
            tsunami: feature["properties"]["tsunami"]
          }
        end
        EqFeature.create(eq_features)
        puts "Database populated successfully!"
      else
        puts "Error: API request failed with status code #{response.code}"
      end
    rescue StandardError => e
      puts "Error: An error occurred during data population: #{e.message}"
    end

  end
end
