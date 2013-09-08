require "#{Rails.root}/lib/service/client"

module Service
  def self.get_client
    Service::Client.new(get_service_config)
  end

  def self.get_service_config
    config = Presentation::Application.config.core_backend
    config.protocol ||= "http"
    config.port ||= "80"
    config
  end
end
