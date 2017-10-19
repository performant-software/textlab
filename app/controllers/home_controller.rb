class HomeController < ApplicationController

  before_action :authenticate_user!

  def index
    if current_user.account_status == 'active'
      render layout: "textlab"
    elsif current_user.account_status == 'pending'
      render 'pending'
    else
      render 'archived'
    end
  end

end
