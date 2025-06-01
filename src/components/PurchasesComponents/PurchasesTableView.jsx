import React from "react";

const PurchasesTableView = ({ purchases, handlePurchaseClick }) => {
  return (
    <div className="mt p-4 relative">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/80 backdrop-blur-sm">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  Heure
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  Contenu
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  Prix Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {purchases.map((purchase) => (
                <tr
                  key={purchase._id}
                  className="hover:bg-gray-50/50 cursor-pointer transition-all duration-200"
                  onClick={(e) => handlePurchaseClick(purchase, e)}
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {new Date(purchase.date).toLocaleDateString("fr-FR")}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{purchase.time}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col space-y-1">
                      {purchase.orderContent?.map((item, i) => (
                        <div key={i} className="text-sm text-gray-700">
                          <span className="font-medium">{item.quantity}x</span>{" "}
                          {item.product?.name || "Product"}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {purchase.totalPrice} DT
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PurchasesTableView;
