import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Layout from '../components/Layout';
import Toast from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { TableWithSession } from '../services/types';
import { api } from '../services/api';
import { formatCurrency } from '../services/utils';

type ToastType = { message: string; type: 'success' | 'error' | 'info' } | null;

export default function TableManagementPage() {
  const [tables, setTables] = useState<TableWithSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newTableNo, setNewTableNo] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [toast, setToast] = useState<ToastType>(null);
  const [qrModalTable, setQrModalTable] = useState<TableWithSession | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
  };

  // Fetch tables
  const fetchTables = async () => {
    const response = await api.getTables();
    if (response.success && response.data) {
      setTables(response.data);
    } else {
      showToast('Failed to load tables', 'error');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTables();
  }, []);

  // Create table
  const handleCreateTable = async () => {
    if (!newTableNo.trim()) {
      showToast('Table number is required', 'error');
      return;
    }

    setIsCreating(true);
    const response = await api.createTable(newTableNo.trim());

    if (response.success) {
      showToast(`Table ${newTableNo} created successfully!`, 'success');
      setNewTableNo('');
      setShowCreateForm(false);
      fetchTables();
    } else {
      showToast(response.error || 'Failed to create table', 'error');
    }

    setIsCreating(false);
  };

  // Toggle table status
  const handleToggleStatus = async (table: TableWithSession) => {
    const response = await api.toggleTableStatus(table.id, !table.isActive);
    if (response.success) {
      showToast(`Table ${table.tableNo} ${!table.isActive ? 'activated' : 'deactivated'}`, 'success');
      fetchTables();
    } else {
      showToast('Failed to update table status', 'error');
    }
  };

  // Settle table
  const handleSettleTable = async (table: TableWithSession) => {
    const response = await api.settleTable(table.id);
    if (response.success) {
      showToast(`Table ${table.tableNo} settled!`, 'success');
      fetchTables();
    } else {
      showToast('Failed to settle table', 'error');
    }
  };

  // Delete table
  const handleDeleteTable = async (table: TableWithSession) => {
    if (!confirm(`Delete Table ${table.tableNo}? This cannot be undone.`)) return;

    const response = await api.deleteTable(table.id);
    if (response.success) {
      showToast(`Table ${table.tableNo} deleted`, 'success');
      fetchTables();
    } else {
      showToast(response.error || 'Failed to delete table', 'error');
    }
  };

  // Generate menu URL for a table
  const getMenuUrl = (table: TableWithSession) => {
    return `${window.location.origin}/menu/${table.qrToken}`;
  };

  return (
    <Layout title="Table Management">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">🪑 Table Management</h1>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            + Add Table
          </button>
        </div>

        {/* Create Table Form */}
        {showCreateForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-2 border-blue-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Create New Table</h3>
            <div className="flex gap-4">
              <input
                type="text"
                value={newTableNo}
                onChange={(e) => setNewTableNo(e.target.value)}
                placeholder="Table number (e.g., T6, A1, Patio-1)"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) => e.key === 'Enter' && handleCreateTable()}
              />
              <button
                onClick={handleCreateTable}
                disabled={isCreating}
                className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 transition-colors"
              >
                {isCreating ? 'Creating...' : 'Create'}
              </button>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setNewTableNo('');
                }}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Tables Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="lg" />
            <span className="ml-4 text-xl text-gray-600">Loading tables...</span>
          </div>
        ) : tables.length === 0 ? (
          <EmptyState
            icon="🪑"
            title="No tables yet"
            description="Create your first table to start generating QR codes"
            action={{
              label: '+ Add Table',
              onClick: () => setShowCreateForm(true),
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tables.map((table) => (
              <div
                key={table.id}
                className={`bg-white rounded-xl shadow-md border-2 p-6 transition-all ${
                  table.isActive ? 'border-gray-200' : 'border-red-200 opacity-75'
                }`}
              >
                {/* Table Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Table {table.tableNo}</h3>
                    <span
                      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full mt-1 ${
                        table.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {table.isActive ? '● Active' : '● Inactive'}
                    </span>
                  </div>

                  {/* QR Preview */}
                  <button
                    onClick={() => setQrModalTable(table)}
                    className="p-2 border-2 border-gray-200 rounded-lg hover:border-blue-400 transition-colors cursor-pointer"
                    title="Click to enlarge QR code"
                  >
                    <QRCodeSVG value={getMenuUrl(table)} size={64} />
                  </button>
                </div>

                {/* Session Info */}
                {table.activeSession.orderCount > 0 && (
                  <div className="bg-blue-50 rounded-lg p-3 mb-4 border border-blue-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-blue-800">Active Session</p>
                        <p className="text-xs text-blue-600">
                          {table.activeSession.orderCount} order{table.activeSession.orderCount !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <p className="text-lg font-bold text-blue-700">
                        {formatCurrency(table.activeSession.totalAmount)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setQrModalTable(table)}
                    className="w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    📱 View QR Code
                  </button>

                  {table.activeSession.orderCount > 0 && (
                    <button
                      onClick={() => handleSettleTable(table)}
                      className="w-full px-4 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      💳 Settle Table
                    </button>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleStatus(table)}
                      className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        table.isActive
                          ? 'text-yellow-700 bg-yellow-50 hover:bg-yellow-100'
                          : 'text-green-700 bg-green-50 hover:bg-green-100'
                      }`}
                    >
                      {table.isActive ? '⏸ Deactivate' : '▶ Activate'}
                    </button>
                    <button
                      onClick={() => handleDeleteTable(table)}
                      className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {qrModalTable && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setQrModalTable(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Table {qrModalTable.tableNo}
            </h2>
            <p className="text-gray-600 mb-6">Scan to order from this table</p>

            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white border-4 border-gray-200 rounded-xl">
                <QRCodeSVG
                  value={getMenuUrl(qrModalTable)}
                  size={256}
                  level="H"
                  includeMargin
                />
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 mb-6">
              <p className="text-xs text-gray-500 mb-1">Menu URL</p>
              <p className="text-sm text-gray-700 font-mono break-all">
                {getMenuUrl(qrModalTable)}
              </p>
            </div>

            <button
              onClick={() => setQrModalTable(null)}
              className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}
