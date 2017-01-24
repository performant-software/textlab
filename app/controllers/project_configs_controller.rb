class ProjectConfigsController < ApplicationController
  before_action :set_project_config, only: [:show, :update, :destroy]
  before_action :authenticate_user!

  # GET /zones.json
  def index
    @project_configs = ProjectConfig.get_all
    render json: @project_configs
  end

  # GET /project_configs/1.json
  def show
    render json: @project_config.obj
  end

  # POST /zones.json
  def create
    @project_config = ProjectConfig.new(project_config_params)

    if @project_config.save
      render json: @project_config.obj
    else
      render json: @project_config.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /project_configs/1.json
  def update
    if @project_config.update(project_config_params)
      render json: @project_config.obj
    else
      render json: @project_config.errors, status: :unprocessable_entity
    end
  end

  # DELETE /project_configs/1.json
  def destroy
    if @project_config.destroy
      head :no_content
    else
      render json: @project_config.errors, status: :not_destroyed
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_project_config
      @project_config = ProjectConfig.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def project_config_params
      params.permit( :id, :name, :description, :tags, :vocabs )
    end
end
