import { PickingItem } from "@/types";
import { exportToCSV } from "@/utils/dataLoader";
import {
  Download,
  FileText,
  Package,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
} from "lucide-react";
import { useState } from "react";

function PickingListTable({ items }: { items: PickingItem[] }) {
  const [sortConfig, setSortConfig] = useState<{
    key: "productId" | "name" | "boxType" | "quantity" | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });

  const handleSort = (key: "productId" | "name" | "boxType" | "quantity") => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const sortedItems = (() => {
    if (!sortConfig.key) return items;
    const key = sortConfig.key;
    const sorted = [...items].sort((a, b) => {
      if (key === "quantity") {
        const aValue = a[key];
        const bValue = b[key];
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      } else {
        const aValue = a[key] || "";
        const bValue = b[key] || "";
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      }
    });
    return sorted;
  })();

  const getBoxTypeColor = (boxType: string) => {
    switch (boxType.toLowerCase()) {
      case "valentine":
        return "bg-red-100 text-red-800";
      case "birthday":
        return "bg-purple-100 text-purple-800";
      case "client":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatBoxType = (boxType: string) => {
    const cleanType = boxType.toLowerCase().replace(/\s*box\s*$/, "");
    return cleanType.charAt(0).toUpperCase() + cleanType.slice(1);
  };

  if (items.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-5 h-5 text-orange-600" />
          <h2 className="text-lg font-semibold text-gray-800">Picking List</h2>
        </div>
        <div className="text-center py-8 text-gray-500">
          <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No orders found for the selected date.</p>
        </div>
      </div>
    );
  }

  const renderSortIcon = (
    key: "productId" | "name" | "boxType" | "quantity"
  ) => {
    if (sortConfig.key !== key) {
      return <ChevronsUpDown className="inline w-4 h-4 ml-1 text-gray-400" />;
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="inline w-4 h-4 ml-1 text-gray-700" />
    ) : (
      <ChevronDown className="inline w-4 h-4 ml-1 text-gray-700" />
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-orange-600" />
          <h2 className="text-lg font-semibold text-gray-800">Picking List</h2>
          <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {items.length} items
          </span>
        </div>
        <button
          onClick={() => exportToCSV(sortedItems, sortConfig)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th
                className="text-left py-3 px-4 font-semibold text-gray-700 cursor-pointer select-none"
                onClick={() => handleSort("productId")}
              >
                Product ID {renderSortIcon("productId")}
              </th>
              <th
                className="text-left py-3 px-4 font-semibold text-gray-700 cursor-pointer select-none"
                onClick={() => handleSort("name")}
              >
                Product Name {renderSortIcon("name")}
              </th>
              <th
                className="text-left py-3 px-4 font-semibold text-gray-700 cursor-pointer select-none"
                onClick={() => handleSort("boxType")}
              >
                Box Type {renderSortIcon("boxType")}
              </th>
              <th
                className="text-right py-3 px-4 font-semibold text-gray-700 cursor-pointer select-none"
                onClick={() => handleSort("quantity")}
              >
                Quantity {renderSortIcon("quantity")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedItems.map((item, index) => (
              <tr
                key={`${item.productId}-${item.orderId}-${index}`}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="py-3 px-4 border-b border-gray-200 font-mono text-sm text-gray-600">
                  {item.productId}
                </td>
                <td className="py-3 px-4 border-b border-gray-200 text-gray-800">
                  {item.name}
                </td>
                <td className="py-3 px-4 border-b border-gray-200">
                  <span
                    className={`text-sm font-medium px-2.5 py-1 rounded-full ${getBoxTypeColor(
                      formatBoxType(item.boxType)
                    )}`}
                  >
                    {formatBoxType(item.boxType)}
                  </span>
                </td>
                <td className="py-3 px-4 border-b border-gray-200 text-right">
                  <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-1 rounded-full">
                    ×{item.quantity}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PickingListTable;
