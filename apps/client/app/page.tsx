// apps/client/app/page.tsx
import { Button } from "@repo/ui";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center py-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
        <h1 className="text-4xl font-bold mb-4">Chào mừng đến với MyShop</h1>
        <p className="text-xl mb-8">Mua sắm thông minh, giá tốt nhất</p>
        <Button variant="primary">Mua sắm ngay</Button>
      </div>
    </div>
  );
}
