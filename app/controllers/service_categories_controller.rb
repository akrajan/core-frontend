class ServiceCategoriesController < ApplicationController
  def index
    @categories, @errors = ServiceCategory.all
  end
end
