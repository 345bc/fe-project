// apps/admin/app/page.tsx
import { Button } from "@repo/ui";

export default function AdminDashboard() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button variant="primary">Export Data</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-gray-500">Doanh thu</div>
          <div className="text-2xl font-bold text-green-600">125.000.000đ</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-gray-500">Đơn hàng</div>
          <div className="text-2xl font-bold text-blue-600">1,234</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-gray-500">Người dùng</div>
          <div className="text-2xl font-bold text-purple-600">5,678</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-gray-500">Sản phẩm</div>
          <div className="text-2xl font-bold text-orange-600">234</div>
        </div>
      </div>
    </div>
  );
}
