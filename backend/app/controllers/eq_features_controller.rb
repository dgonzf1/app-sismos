class EqFeaturesController < ApplicationController
  before_action :set_eq_feature, only: %i[ show update destroy ]

  # GET /eq_features
  def index
    per_page = Kaminari.config.max_per_page
    per_page = params[:per_page].to_i.positive? ? params[:per_page].to_i : per_page
    @eq_features = EqFeature.page(params[:page]).per(per_page)
    pagination_info = {
      current_page: @eq_features.current_page,
      total: @eq_features.total_count,
      per_page: @eq_features.current_per_page
    }

    response_data = {
      data: @eq_features,
      pagination: pagination_info
    }
    render json: response_data
  end

  # GET /eq_features/1
  def show
    render json: @eq_feature
  end

  # POST /eq_features
  def create
    @eq_feature = EqFeature.new(eq_feature_params)

    if @eq_feature.save
      render json: @eq_feature, status: :created, location: @eq_feature
    else
      render json: @eq_feature.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /eq_features/1
  def update
    if @eq_feature.update(eq_feature_params)
      render json: @eq_feature
    else
      render json: @eq_feature.errors, status: :unprocessable_entity
    end
  end

  # DELETE /eq_features/1
  def destroy
    @eq_feature.destroy!
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_eq_feature
      @eq_feature = EqFeature.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def eq_feature_params
      params.require(:eq_feature).permit(:feature_id, :mag, :place, :time, :url, :tsunami, :magType, :title, :longitude, :latitude, :comments)
    end
end
