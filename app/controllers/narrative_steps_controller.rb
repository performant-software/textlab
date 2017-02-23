class NarrativeStepsController < ApplicationController
  before_action :set_narrative_step, only: [:show, :update, :destroy]
  before_action :authenticate_user!

  # GET /narrative_steps/1.json
  def show
    render json: @narrative_step.obj
  end

  # POST /narrative_steps.json
  def create
    @narrative_step = NarrativeStep.new(narrative_step_params)

    if @narrative_step.save
      render json: @narrative_step.obj
    else
      render json: @narrative_step.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /narrative_steps/1.json
  def update    
    if @narrative_step.update(narrative_step_params)
      render json: @narrative_step.obj
    else
      render json: @narrative_step.errors, status: :unprocessable_entity
    end
  end

  # DELETE /narrative_steps/1.json
  def destroy
    if @narrative_step.destroy
      head :no_content
    else
      render json: @narrative_step.errors, status: :not_destroyed
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_narrative_step
      @narrative_step = NarrativeStep.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def narrative_step_params
      params.permit( :id, :step_number, :new_step_number, :sequence_id, :zone_id, :step, :narrative )
    end
end
