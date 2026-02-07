'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';
import { formatCurrency, formatDate, getTodayDate } from '@/lib/utils';
import {
  DailySalesReport,
  ItemSalesReport,
  PaymentModeSummary,
} from '@/lib/types';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<'daily' | 'item' | 'payment'>('daily');
  const [dailySales, setDailySales] = useState<DailySalesReport | null>(null);
  const [itemSales, setItemSales] = useState<ItemSalesReport[]>([]);
  const [paymentSummary, setPaymentSummary] = useState<PaymentModeSummary[]>([]);
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [startDate, setStartDate] = useState(getTodayDate());
  const [endDate, setEndDate] = useState(getTodayDate());
  const [isLoading, setIsLoading] = useState(false);

  // Fetch daily sales
  const fetchDailySales = async (date: string) => {
    setIsLoading(true);
    const response = await api.getDailySales(date);
    if (response.success && response.data) {
      setDailySales(response.data);
    }
    setIsLoading(false);
  };

  // Fetch item sales
  const fetchItemSales = async (start: string, end: string) => {
    setIsLoading(true);
    const response = await api.getItemSales(start, end);
    if (response.success && response.data) {
      setItemSales(response.data);
    }
    setIsLoading(false);
  };

  // Fetch payment summary
  const fetchPaymentSummary = async (start: string, end: string) => {
    setIsLoading(true);
    const response = await api.getPaymentSummary(start, end);
    if (response.success && response.data) {
      setPaymentSummary(response.data);
    }
    setIsLoading(false);
  };

  // Initial load
  useEffect(() => {
    if (activeTab === 'daily') {
      fetchDailySales(selectedDate);
    } else if (activeTab === 'item') {
      fetchItemSales(startDate, endDate);
    } else if (activeTab === 'payment') {
      fetchPaymentSummary(startDate, endDate);
    }
  }, [activeTab]);

  return (
    <Layout role="CASHIER" title="Reports">
      <div>
        {/* Back Button */}
        <div className="mb-6">
          <a
            href="/cashier"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Cashier
          </a>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('daily')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'daily'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Daily Sales
          </button>
          <button
            onClick={() => setActiveTab('item')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'item'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Item-wise Sales
          </button>
          <button
            onClick={() => setActiveTab('payment')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'payment'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Payment Summary
          </button>
        </div>

        {/* Daily Sales Report */}
        {activeTab === 'daily' && (
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center gap-4">
                <label className="font-medium text-gray-700">Select Date:</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                />
                <button
                  onClick={() => fetchDailySales(selectedDate)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Load Report
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-12">Loading...</div>
            ) : dailySales ? (
              <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      Total Orders
                    </h3>
                    <p className="text-4xl font-bold text-blue-600">
                      {dailySales.totalOrders}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      Total Revenue
                    </h3>
                    <p className="text-4xl font-bold text-green-600">
                      {formatCurrency(dailySales.totalRevenue)}
                    </p>
                  </div>
                </div>

                {/* Orders by Status */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Orders by Status
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(dailySales.ordersByStatus).map(([status, count]) => (
                      <div key={status} className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">{status}</p>
                        <p className="text-2xl font-bold text-gray-900">{count}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Orders by Payment Mode */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Orders by Payment Mode
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(dailySales.ordersByPaymentMode).map(
                      ([mode, count]) => (
                        <div key={mode} className="text-center p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">{mode}</p>
                          <p className="text-2xl font-bold text-gray-900">{count}</p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                Select a date and load the report
              </div>
            )}
          </div>
        )}

        {/* Item-wise Sales Report */}
        {activeTab === 'item' && (
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center gap-4 flex-wrap">
                <label className="font-medium text-gray-700">Date Range:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                />
                <span>to</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                />
                <button
                  onClick={() => fetchItemSales(startDate, endDate)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Load Report
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-12">Loading...</div>
            ) : itemSales.length > 0 ? (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Product Name
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Category
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                        Quantity Sold
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                        Total Revenue
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {itemSales.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {item.productName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {item.category}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 text-right">
                          {item.quantitySold}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">
                          {formatCurrency(item.totalRevenue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-100">
                    <tr>
                      <td
                        colSpan={2}
                        className="px-6 py-4 text-sm font-bold text-gray-900"
                      >
                        TOTAL
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                        {itemSales.reduce((sum, item) => sum + item.quantitySold, 0)}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                        {formatCurrency(
                          itemSales.reduce((sum, item) => sum + item.totalRevenue, 0)
                        )}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                No sales data for selected date range
              </div>
            )}
          </div>
        )}

        {/* Payment Summary Report */}
        {activeTab === 'payment' && (
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center gap-4 flex-wrap">
                <label className="font-medium text-gray-700">Date Range:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                />
                <span>to</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                />
                <button
                  onClick={() => fetchPaymentSummary(startDate, endDate)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Load Report
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-12">Loading...</div>
            ) : paymentSummary.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {paymentSummary.map((item) => (
                  <div
                    key={item.paymentMode}
                    className="bg-white rounded-lg shadow-md p-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                      {item.paymentMode}
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-600">Number of Orders</p>
                        <p className="text-3xl font-bold text-blue-600">{item.count}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Amount</p>
                        <p className="text-3xl font-bold text-green-600">
                          {formatCurrency(item.totalAmount)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                No payment data for selected date range
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
