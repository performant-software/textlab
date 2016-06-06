class HomeController < ApplicationController

  before_action :authenticate_user!

  def index
    if current_user.enabled?
      render layout: "textlab"
    else
      render 'disabled'
    end
  end

end
