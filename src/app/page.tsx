"use client";

import { useState, useEffect } from "react";
import DatePicker from "@/components/DatePicker";
import OrderSummary from "@/components/OrderSummary";
import PickingListTable from "@/components/PickingListTable";
import { PickingItem, Order, ProductMappings } from "@/types";
import {
  loadOrders,
  loadProductMappings,
  getAvailableDates,
} from "@/utils/dataLoader";
import { generatePickingList } from "@/lib/pickingListGenerator";

export default function WarehousePickingApp() {
  const [selectedDate, setSelectedDate] = useState("");
  const [pickingList, setPickingList] = useState<PickingItem[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [productMappings, setProductMappings] = useState<ProductMappings>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [ordersData, productData] = await Promise.all([
          loadOrders(),
          loadProductMappings(),
        ]);

        setOrders(ordersData);
        setProductMappings(productData);

        const dates = getAvailableDates(ordersData);
        setAvailableDates(dates);
        if (dates.length > 0) {
          setSelectedDate(dates[0]);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    if (
      selectedDate &&
      orders.length > 0 &&
      Object.keys(productMappings).length > 0
    ) {
      const list = generatePickingList(orders, selectedDate, productMappings);
      setPickingList(list);
    }
  }, [selectedDate, orders, productMappings]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Warehouse Picking List Generator
          </h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">
              Loading warehouse data...
            </div>
          </div>
        ) : (
          <>
            {/* main content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-1">
                <DatePicker
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                  availableDates={availableDates}
                />
              </div>
              <div className="lg:col-span-2">
                <OrderSummary orders={orders} selectedDate={selectedDate} />
              </div>
            </div>

            {/* picking list */}
            <PickingListTable items={pickingList} />
          </>
        )}

        {/* footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Built for Cozey technical assignment • Christin Z</p>
        </div>
      </div>
    </div>
  );
}
