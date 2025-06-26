import { Order, PickingItem, ProductMappings } from "../types";

export async function loadOrders(): Promise<Order[]> {
  try {
    const ordersModule = await import("@/data/orders.json");
    return ordersModule.default;
  } catch (error) {
    console.error("Error loading orders:", error);
    return [];
  }
}

export async function loadProductMappings(): Promise<ProductMappings> {
  try {
    const productsModule = await import("@/data/productMappings.json");
    const productsArray = productsModule.default;

    const productMappings: ProductMappings = {};
    productsArray.forEach((productObj: Record<string, unknown>) => {
      const productId = Object.keys(productObj)[0];
      productMappings[productId] = productObj[
        productId
      ] as ProductMappings[string];
    });

    return productMappings;
  } catch (error) {
    console.error("Error loading product mappings:", error);
    return {};
  }
}

export function getAvailableDates(orders: Order[]): string[] {
  const dates = orders.map((order) => order.orderDate);
  const uniqueDates = Array.from(new Set(dates));
  return uniqueDates.sort().reverse();
}

export function formatDisplayDate(dateString: string): string {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function parseDateString(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatDateToString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function exportToCSV(
  pickingList: PickingItem[],
  sortConfig?: {
    key: "productId" | "name" | "boxType" | "quantity" | null;
    direction: "asc" | "desc";
  }
): void {
  let sortedItems = [...pickingList];
  if (sortConfig?.key) {
    const key = sortConfig.key;
    sortedItems.sort((a, b) => {
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
  }

  const csvContent = [
    ["Product ID", "Product Name", "Box Type", "Order ID", "Quantity"],
    ...sortedItems.map((item) => [
      item.productId,
      item.name,
      item.boxType,
      item.orderId,
      item.quantity.toString(),
    ]),
  ]
    .map((row) => row.join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `picking-list-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
}
