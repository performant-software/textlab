Rails.application.routes.draw do
  devise_for :users, :controllers => { registrations: 'registrations' }


  devise_scope :user do
    authenticated :user do
      root 'home#index', as: :authenticated_root
    end

    unauthenticated do
      root 'devise/sessions#new', as: :unauthenticated_root
    end

	get '/users/sign_out' => 'devise/sessions#destroy'
  end


  resources :diplos, only: [ :show, :update, :create, :destroy ]
  resources :documents, only: [ :index, :show, :update, :create, :destroy ]
  resources :document_exports, only: [ :index, :show ]
  resources :document_nodes, only: [ :show, :update, :create, :destroy ]
  resources :document_sections, only: [ :show, :update, :create, :destroy ]
  resources :leafs, only: [ :show, :update, :create, :destroy ]
  resources :memberships, only: [ :show, :update, :create, :destroy ]
  resources :narrative_steps, only: [ :show, :update, :create, :destroy ]
  resources :project_configs, only: [ :index, :show, :update, :create, :destroy ]
  resources :sequences, only: [ :index, :show, :update, :create, :destroy ]
  resources :transcriptions, only: [ :index, :show, :update, :create, :destroy ]
  resources :zones, only: [ :show, :update, :create, :destroy ]
  resources :zone_links, only: [ :show, :update, :create, :destroy ]
  resources :accounts, only: [ :index, :show, :update ]
  resources :sites, only: [ :index, :show, :update, :create, :destroy ]

end
