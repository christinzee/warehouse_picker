import { getOrderSummary } from "@/lib/pickingListGenerator";
import { Order } from "@/types";
import { Package, User, MapPin, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";

function OrderSummary({
  orders,
  selectedDate,
}: {
  orders: Order[];
  selectedDate: string;
}) {
  const summary = getOrderSummary(orders, selectedDate);
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");

  const ordersForSelectedDate = orders.filter(
    (order) => order.orderDate === selectedDate
  );

  useEffect(() => {
    if (
      !ordersForSelectedDate.find((order) => order.orderId === selectedOrderId)
    ) {
      setSelectedOrderId("");
    }
  }, [selectedDate, selectedOrderId, ordersForSelectedDate]);

  const selectedOrder = ordersForSelectedDate.find(
    (order) => order.orderId === selectedOrderId
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-3 mb-4">
        <Package className="w-5 h-5 text-green-600" />
        <h2 className="text-lg font-semibold text-gray-800">Orders Summary</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
          <div>
            <p className="text-2xl font-bold text-green-700">
              {summary.totalOrders}
            </p>
            <p className="text-sm text-green-600">Total Orders</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
          <div>
            <p className="text-2xl font-bold text-purple-700">
              {Object.values(summary.giftBoxCounts).reduce(
                (sum, count) => sum + count,
                0
              )}
            </p>
            <p className="text-sm text-purple-600">Gift Boxes</p>
          </div>
        </div>
      </div>

      {ordersForSelectedDate.length > 0 && (
        <div>
          <h3 className="font-medium text-gray-700 mb-4">Order Details</h3>

          <div className="mb-6">
            <label
              htmlFor="order-select"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select Order
            </label>
            <select
              id="order-select"
              value={selectedOrderId}
              onChange={(e) => setSelectedOrderId(e.target.value)}
              className="w-full p-3 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-1 focus:ring-blue-300"
            >
              <option value="">Choose an order...</option>
              {ordersForSelectedDate.map((order) => (
                <option key={order.orderId} value={order.orderId}>
                  Order #{order.orderId} - {order.customerName}
                </option>
              ))}
            </select>
          </div>

          {/* order details display */}
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* customer information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Customer Information
                  </h4>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Name:</span>{" "}
                      {selectedOrder.customerName}
                    </p>
                    <p className="text-sm flex items-center gap-2">
                      <span className="font-medium">Email:</span>{" "}
                      {selectedOrder.customerEmail}
                    </p>
                  </div>
                </div>

                {/* shipping address */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Shipping Address
                  </h4>
                  <div className="text-sm">
                    <p>{selectedOrder.shippingAddress.street}</p>
                    <p>
                      {selectedOrder.shippingAddress.city},{" "}
                      {selectedOrder.shippingAddress.province}{" "}
                      {selectedOrder.shippingAddress.postalCode}
                    </p>
                    <p>{selectedOrder.shippingAddress.country}</p>
                  </div>
                </div>
              </div>

              {/* line items */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Line Items
                </h4>
                <div className="space-y-3">
                  {selectedOrder.lineItems.map((item) => (
                    <div
                      key={item.lineItemId}
                      className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
                    >
                      <p className="font-medium text-sm">{item.productName}</p>
                      <p className="font-medium text-sm text-gray-600">
                        x{item.quantity}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default OrderSummary;
