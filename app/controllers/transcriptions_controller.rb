class TranscriptionsController < ApplicationController
  before_action :set_transcription, only: [:show, :update, :destroy]
  before_action :authenticate_user!

  def index
    # get the transcriptions for a given leaf for current user
    leaf_id = transcription_params[:leaf_id]
    @transcriptions = Transcription.where( { leaf_id: leaf_id, user_id: current_user.id } )
    render json: @transcriptions
  end

  # GET /transcriptions/1.json
  def show
    render json: @transcription.obj
  end

  # POST /transcriptions.json
  def create
    @transcription = Transcription.new(transcription_params)
    @transcription.user = current_user

    if @transcription.save
      render json: @transcription.obj
    else
      render json: @transcription.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /transcriptions/1.json
  def update
    
    # rails deep munge substitutes [] with nil, but we always want 
    # to keep this list in sync with editor
    if transcription_params[:zone_links_json].nil?
      @transcription.zone_links.clear
    end
    
    if @transcription.update(transcription_params)
      render json: @transcription.obj
    else
      render json: @transcription.errors, status: :unprocessable_entity
    end
  end

  # DELETE /transcriptions/1.json
  def destroy
    if @transcription.destroy
      head :no_content
    else
      render json: @transcription.errors, status: :not_destroyed
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_membership
      @transcription = Transcription.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def transcription_params
      params.permit( :name, :content, :shared, :submitted, :leaf_id, :document_id, zone_links_json: [ :offset, :zone_label, :leaf_id ] )
    end
end
