module ServiceCategoriesHelper
  include ApplicationHelper

  def sku_price_range(sku)
    "$#{two_decimals sku.min_price} - $#{two_decimals sku.max_price}"
  end

  def sku_time(sku)
    two_decimals(sku.min_duration) + " hrs"
  end

  def two_decimals(num)
    sprintf("%05.2f", num)
  end
end
