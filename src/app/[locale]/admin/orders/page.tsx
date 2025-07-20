import React from "react";

async function OrdersPage() {
  const res = await fetch(`/api/order`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    // cache: "no-store", // Optional: if using app router and want fresh data
  });

  const data = await res.json();
  const orders = data.orders;

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">All Orders</h1>

      <div className="space-y-8 max-w-3xl mx-auto">
        {orders.length === 0 ? (
          <p className="text-center text-gray-500">No orders found.</p>
        ) : (
          orders.map((order: any) => (
            <div
              key={order.id}
              className="border border-gray-200 p-6 rounded-2xl shadow-md bg-white hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                <div>
                  <p className="text-lg font-semibold text-gray-700">
                    <span className="mr-2">Order by:</span> {order.userEmail}
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Created:</strong> {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${order.paid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                >
                  {order.paid ? "Paid" : "Unpaid"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="mb-1"><strong>Phone:</strong> {order.phone}</p>
                  <p className="mb-1"><strong>Address:</strong> {order.streetAddress}, {order.city}, {order.country}, {order.postalCode}</p>
                </div>
                <div>
                  <p className="mb-1"><strong>Subtotal:</strong> <span className="text-gray-700">${order.subTotal}</span></p>
                  <p className="mb-1"><strong>Delivery Fee:</strong> <span className="text-gray-700">${order.deliveryFee}</span></p>
                  <p className="mb-1"><strong>Total Price:</strong> <span className="font-bold text-lg text-blue-700">${order.totalPrice}</span></p>
                </div>
              </div>

              <div className="mt-4">
                <strong className="block mb-2 text-gray-700">Products:</strong>
                <ul className="divide-y divide-gray-100 bg-gray-50 rounded-lg overflow-hidden">
                  {order.products.map((item: any, index: number) => (
                    <li key={index} className="flex justify-between items-center px-4 py-2 text-sm">
                      <span>{item.product?.name || "Unknown Product"}</span>
                      <span className="text-gray-500">Qty: {item.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default OrdersPage;
