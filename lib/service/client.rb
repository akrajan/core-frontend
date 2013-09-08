require 'faraday'

module Service
  class Client
    attr_accessor :config, :conn

    def get(*args, &block)
      @conn.get *args, &block
    end

    def base_path
      @config.base_path || ""
    end

    def initialize(config)
      @config = config
      url = "#{config.protocol}://#{config.url}:#{config.port}"
      @conn = Faraday.new(:url => url) do |faraday|
        faraday.request  :url_encoded             # form-encode POST params
        faraday.response :logger                  # log requests to STDOUT
        faraday.adapter  Faraday.default_adapter  # make requests with Net::HTTP
      end
    end
  end
end
