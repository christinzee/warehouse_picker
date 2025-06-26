import { Order, ProductMappings, PickingItem } from "../types/index";

export function filterOrdersByDate(
  orders: Order[],
  targetDate: string
): Order[] {
  return orders.filter((order) => order.orderDate === targetDate);
}

export function expandGiftBox(
  productId: string,
  quantity: number,
  productMappings: ProductMappings
): PickingItem[] {
  const productMapping = productMappings[productId];

  if (!productMapping) {
    console.warn(`No mapping found for product: ${productId}`);
    return [];
  }

  return productMapping.components.map((component) => ({
    productId: component.productId,
    name: component.name,
    quantity: component.quantity * quantity,
    boxType: productMapping.name,
    orderId: "",
  }));
}

export function processOrder(
  order: Order,
  productMappings: ProductMappings
): PickingItem[] {
  const allPickingItems: PickingItem[] = [];

  order.lineItems.forEach((lineItem) => {
    const expandedItems = expandGiftBox(
      lineItem.productId,
      lineItem.quantity,
      productMappings
    );

    expandedItems.forEach((item) => {
      allPickingItems.push({
        ...item,
        boxType: lineItem.productName,
        orderId: order.orderId,
      });
    });
  });

  return allPickingItems;
}

// main function to generate picking list
export function generatePickingList(
  orders: Order[],
  targetDate: string,
  productMappings: ProductMappings
): PickingItem[] {
  // filter orders by date
  const filteredOrders = filterOrdersByDate(orders, targetDate);

  // process each order and expand gift boxes with order details
  const allPickingItems: PickingItem[] = [];
  filteredOrders.forEach((order) => {
    const orderItems = processOrder(order, productMappings);
    allPickingItems.push(...orderItems);
  });

  // aggregate by product ID and box type
  const aggregated: { [key: string]: PickingItem } = {};

  allPickingItems.forEach((item) => {
    const key = `${item.productId}-${item.boxType}`;
    if (aggregated[key]) {
      aggregated[key].quantity += item.quantity;
    } else {
      aggregated[key] = {
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        boxType: item.boxType,
        orderId: item.orderId, 
      };
    }
  });

  // sort by product name, then by box type
  return Object.values(aggregated).sort((a, b) => {
    const nameComparison = a.name.localeCompare(b.name);
    if (nameComparison !== 0) return nameComparison;
    return a.boxType.localeCompare(b.boxType);
  });
}

export function getOrderSummary(orders: Order[], targetDate: string) {
  const filteredOrders = filterOrdersByDate(orders, targetDate);

  const summary = {
    totalOrders: filteredOrders.length,
    totalValue: filteredOrders.reduce(
      (sum, order) => sum + order.orderTotal,
      0
    ),
    giftBoxCounts: {} as { [key: string]: number },
  };

  filteredOrders.forEach((order) => {
    order.lineItems.forEach((lineItem) => {
      if (summary.giftBoxCounts[lineItem.productId]) {
        summary.giftBoxCounts[lineItem.productId] += lineItem.quantity;
      } else {
        summary.giftBoxCounts[lineItem.productId] = lineItem.quantity;
      }
    });
  });

  return summary;
}
