require "test_helper"

class EqFeaturesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @eq_feature = eq_features(:one)
  end

  test "should get index" do
    get eq_features_url, as: :json
    assert_response :success
  end

  test "should create eq_feature" do
    assert_difference("EqFeature.count") do
      post eq_features_url, params: { eq_feature: { comments: @eq_feature.comments, feature_id: @eq_feature.feature_id, latitude: @eq_feature.latitude, longitude: @eq_feature.longitude, mag: @eq_feature.mag, magType: @eq_feature.magType, place: @eq_feature.place, time: @eq_feature.time, title: @eq_feature.title, tsunami: @eq_feature.tsunami, url: @eq_feature.url } }, as: :json
    end

    assert_response :created
  end

  test "should show eq_feature" do
    get eq_feature_url(@eq_feature), as: :json
    assert_response :success
  end

  test "should update eq_feature" do
    patch eq_feature_url(@eq_feature), params: { eq_feature: { comments: @eq_feature.comments, feature_id: @eq_feature.feature_id, latitude: @eq_feature.latitude, longitude: @eq_feature.longitude, mag: @eq_feature.mag, magType: @eq_feature.magType, place: @eq_feature.place, time: @eq_feature.time, title: @eq_feature.title, tsunami: @eq_feature.tsunami, url: @eq_feature.url } }, as: :json
    assert_response :success
  end

  test "should destroy eq_feature" do
    assert_difference("EqFeature.count", -1) do
      delete eq_feature_url(@eq_feature), as: :json
    end

    assert_response :no_content
  end
end
