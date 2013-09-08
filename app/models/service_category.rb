require "#{Rails.root}/lib/service"
require "#{Rails.root}/lib/service/service_category"

class ServiceCategory
  attr_accessor :name, :service_skus, :channel, :error_messages, :id


  def service_model_mapping
  end

  module AdapterServiceCategory
    def self.from_service(service_obj)
      cat = ServiceCategory.new
    end
  end

  def self.all
    Service::ServiceCategory.fetch_service_categories
  end
end
