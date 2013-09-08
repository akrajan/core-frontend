require "#{Rails.root}/lib/service"
require "#{Rails.root}/lib/service/service_category"

class ServiceCategory
  SkusListKey = 'categorySkusList'
  ErrorKey = 'errorMessages'

  def self.all
    resp = Service::ServiceCategory.service_categories
    [resp[SkusListKey], resp[ErrorKey]]
  end
end
