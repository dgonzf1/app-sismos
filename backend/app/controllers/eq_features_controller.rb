class EqFeaturesController < ApplicationController
  before_action :set_eq_feature, only: %i[ show update destroy ]

  # GET /eq_features
  def index
    per_page = Kaminari.config.max_per_page
    per_page = params[:per_page].to_i.positive? ? params[:per_page].to_i : per_page
    mag_type_values = params[:mag_types]&.split(",")&.map(&:strip) || []

    # Filter based on mag_type_values if present
    if mag_type_values.any?
      @eq_features = EqFeature.where(magType: mag_type_values).page(params[:page]).per(per_page)
    else
      @eq_features = EqFeature.page(params[:page]).per(per_page)
    end

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

  # POST /eq_features/add_comment
  def add_comment 
    begin
      # Access JSON data from request body
      request_body = request.body.read

      comment_data = JSON.parse(request_body)
      # Extract feature_id and body from JSON
      feature_id = comment_data["feature_id"]
      body = comment_data["body"]

      # Check for semicolon in body
      if comment_data["body"]&.include?(";")
        raise ArgumentError, "Semicolon (;) not allowed in comment body"
      end
    
      # Find the EqFeature record
      @eq_feature = EqFeature.find_by(id: feature_id)
    
      if @eq_feature.present?
        # Add comment with delimiter (use a unique character like ";")
        existing_comments = @eq_feature.comments.presence || ""
        updated_comments = existing_comments.empty? ? body : "#{existing_comments};#{body}"
        @eq_feature.update!(comments: updated_comments)
    
        # Respond with success message or updated data (optional)
        render json: { message: "Comment added successfully" }, status: :created
      else
        # Handle record not found error
        render json: { error: "EqFeature not found" }, status: :not_found
      end
    rescue JSON::ParserError => e
      # Handle invalid JSON parsing error
      render json: { error: "Invalid JSON format in request body" }, status: :bad_request
    rescue ArgumentError => e
      # Handle semicolon error
      render json: { error: e.message }, status: :unprocessable_entity
    end
  
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
