// order related types
export interface ShippingAddress {
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

export interface LineItem {
  lineItemId: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

export interface Order {
  orderId: string;
  orderTotal: number;
  orderDate: string;
  shippingAddress: ShippingAddress;
  customerName: string;
  customerEmail: string;
  lineItems: LineItem[];
}

// product mapping types
export interface ProductComponent {
  productId: string;
  name: string;
  quantity: number;
}

export interface ProductMapping {
  name: string;
  price: number;
  components: ProductComponent[];
}

export interface ProductMappings {
  [key: string]: ProductMapping;
}

// picking list types
export interface PickingItem {
  productId: string;
  name: string;
  boxType: string;
  orderId: string;
  quantity: number;
}

// component props types
export interface DatePickerProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export interface PickingListTableProps {
  items: PickingItem[];
}

export interface OrderSummaryProps {
  orders: Order[];
  selectedDate: string;
  productMappings: ProductMappings;
}
