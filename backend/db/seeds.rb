# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end
EqFeature.create([
    {
        feature_id: "test feature id 2",
        title: "Test feature",
        url: "Test Url",
        magType: "Test Mag Type",
        longitude: -104.3802,
        latitude: 0.0,
        time: 1710085689202,
        place: "14 km S of Atoka, New Mexico"
        
    }
])
#{"type":"Feature","properties":{"mag":2.5,"place":14 km S of Atoka, New Mexico,"time":1710085689202,"updated":1711809753977,"tz":null,"url":"https://earthquake.usgs.gov/earthquakes/eventpage/us7000m4jy","detail":"https://earthquake.usgs.gov/earthquakes/feed/v1.0/detail/us7000m4jy.geojson","felt":1,"cdi":3.4,"mmi":null,"alert":null,"status":"reviewed","tsunami":0,"sig":96,"net":"us","code":"7000m4jy","ids":",us7000m4jy,","sources":",us,","types":",dyfi,origin,phase-data,","nst":25,"dmin":0.477,"rms":0.28,"gap":81,"magType":"mb_lg","type":"earthquake","title":"M 2.5 - 14 km S of Atoka, New Mexico"},"geometry":{"type":"Point","coordinates":[-104.3802,32.6414,5]},"id":"us7000m4jy"},