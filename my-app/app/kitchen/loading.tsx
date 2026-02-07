export default function KitchenLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mb-4"></div>
        <p className="text-xl text-gray-600">Loading Kitchen Display...</p>
      </div>
    </div>
  );
}
