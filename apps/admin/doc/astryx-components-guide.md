# Hướng dẫn Sử dụng Astryx Design System & Các Ví dụ Thực tế

Tài liệu này hướng dẫn cách tra cứu, nhúng và sử dụng bộ thư viện component **Astryx Design System v0.1.9** (Open-Source Design System từ Meta với 153+ components) trong các dự án React và Next.js.

---

## 1. Cấu hình & Lệnh CLI cơ bản

### Lệnh CLI tra cứu nhanh (Run via Terminal)
Astryx cung cấp bộ CLI mạnh mẽ hỗ trợ tìm kiếm component và template:

```bash
# 1. Tìm kiếm bất kỳ component, doc hoặc template nào
npx astryx search "dashboard table"

# 2. Liệt kê toàn bộ 153 components theo nhóm
npx astryx component --list

# 3. Xem chi tiết props & ví dụ của 1 component cụ thể
npx astryx component Button
npx astryx component SideNav
npx astryx component Table

# 4. Gợi ý bộ component (Kit) cho 1 ý tưởng giao diện
npx astryx build "admin dashboard with stats cards and table"

# 5. Xem mẫu code tham khảo (template)
npx astryx template dashboard --skeleton
```

### Import CSS bắt buộc
Để các component của Astryx hiển thị đúng kiểu dáng, thêm import CSS vào file entry (`globals.css` hoặc `layout.tsx`):

```css
/* Trong globals.css */
@import "@astryxdesign/core/astryx.css";
```

---

## 2. Các Quy Tắc Thiết Kế (Rules & Best Practices)

- **Layout & Spacing**: Sử dụng các component layout (`AppShell`, `SideNav`, `Layout`, `Grid`, `VStack`, `HStack`) thay vì dùng thẻ `<div>` tự định dạng CSS.
- **Trạng thái & Nhãn**: 
  - Dùng `StatusDot` cho các trạng thái hoạt động/lỗi/cảnh báo (Success, Warning, Error, Neutral).
  - Dùng `Badge` cho các số đếm (Counts) hoặc phân loại (Categories).
- **Màu sắc & Tokens**: Sử dụng props màu sắc của component hoặc CSS variables/tokens thay vì dùng màu HEX cứng (vd: `#ffffff`).
- **Thẻ Card**: Dùng `Card` cho các widget dashboard, nhóm cài đặt. Đối với danh sách dữ liệu dày đặc, ưu tiên sử dụng `Table` hoặc `List`.

---

## 3. Các Ví Dụ Component Phổ Biến

### 3.1. Nhóm Khung sườn & Điều hướng (AppShell, SideNav, TopNav)

#### Ví dụ Layout tổng thể (AppShell + SideNav + TopNav):
```tsx
import { AppShell } from "@astryxdesign/core/AppShell";
import { SideNav, SideNavSection, SideNavItem } from "@astryxdesign/core/SideNav";
import { TopNav, TopNavHeading } from "@astryxdesign/core/TopNav";
import { NavIcon } from "@astryxdesign/core/NavIcon";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      variant="elevated"
      contentPadding={6}
      topNav={
        <TopNav
          label="Header navigation"
          heading={
            <TopNavHeading
              heading="ZTRAVEL Admin"
              logo={<NavIcon icon={<span className="material-symbols-outlined">explore</span>} />}
            />
          }
        />
      }
      sideNav={
        <SideNav>
          <SideNavSection title="Quản lý">
            <SideNavItem
              label="Dashboard"
              href="/"
              isSelected
              icon={<span className="material-symbols-outlined">grid_view</span>}
            />
            <SideNavItem
              label="Tài khoản"
              href="/users"
              icon={<span className="material-symbols-outlined">manage_accounts</span>}
            />
          </SideNavSection>
        </SideNav>
      }
    >
      {children}
    </AppShell>
  );
}
```

---

### 3.2. Nhóm Nút bấm (Button & IconButton)

#### Ví dụ Nút hành động, Nút Danger, và Icon Button:
```tsx
import { Button } from "@astryxdesign/core/Button";
import { IconButton } from "@astryxdesign/core/Button";

export function ActionButtons() {
  return (
    <div className="flex gap-3">
      {/* Button mặc định */}
      <Button label="Lưu thay đổi" variant="primary" size="md" />

      {/* Button kèm icon */}
      <Button
        label="Thêm mới Tour"
        variant="primary"
        icon={<span className="material-symbols-outlined">add</span>}
        onClick={() => console.log("Add new tour")}
      />

      {/* Button nguy hiểm / xóa */}
      <Button
        label="Xóa tài khoản"
        variant="destructive"
        size="sm"
        onClick={() => alert("Xác nhận xóa")}
      />

      {/* Icon Button chỉ hiển thị icon */}
      <IconButton
        label="Cài đặt"
        icon={<span className="material-symbols-outlined">settings</span>}
        variant="ghost"
      />
    </div>
  );
}
```

---

### 3.3. Nhóm Hiển thị thông số (Card, Badge, StatusDot)

#### Ví dụ Stat Card Thống kê Dashboard:
```tsx
import { Card } from "@astryxdesign/core/Card";
import { Heading, Text } from "@astryxdesign/core/Text";
import { StatusDot } from "@astryxdesign/core/StatusDot";
import { Badge } from "@astryxdesign/core/Badge";
import { HStack, VStack } from "@astryxdesign/core/Stack";

export function StatWidget() {
  return (
    <Card variant="default" elevation="low" width={300}>
      <VStack gap={2}>
        <HStack justify="between" align="center">
          <Text type="supporting">TỔNG DOANH THU</Text>
          <Badge label="+12.5%" variant="green" />
        </HStack>
        <Heading level={2}>8.868.320.000 ₫</Heading>
        <HStack gap={1.5} align="center">
          <StatusDot variant="success" label="Đang tăng trưởng" />
          <Text type="supporting">Tăng so với tháng trước</Text>
        </HStack>
      </VStack>
    </Card>
  );
}
```

---

### 3.4. Nhóm Nhập liệu & Lựa chọn (Selector, TextInput, Switch)

#### Ví dụ Bộ lọc Dropdown (Selector) và Ô nhập liệu (TextInput):
```tsx
import { useState } from "react";
import { Selector } from "@astryxdesign/core/Selector";
import { TextInput } from "@astryxdesign/core/TextInput";
import { Switch } from "@astryxdesign/core/Switch";

export function FilterForm() {
  const [period, setPeriod] = useState("30d");
  const [search, setSearch] = useState("");
  const [isActive, setIsActive] = useState(true);

  const options = [
    { label: "7 ngày qua", value: "7d" },
    { label: "30 ngày qua", value: "30d" },
    { label: "Tất cả thời gian", value: "all" },
  ];

  return (
    <div className="space-y-4">
      {/* TextInput */}
      <TextInput
        label="Tìm kiếm Tour"
        placeholder="Nhập tên tour..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Selector Dropdown */}
      <Selector
        label="Thời gian"
        options={options}
        value={period}
        onChange={(val) => setPeriod(val)}
      />

      {/* Switch Toggle */}
      <Switch
        label="Kích hoạt công khai"
        isChecked={isActive}
        onChange={(checked) => setIsActive(checked)}
      />
    </div>
  );
}
```

---

### 3.5. Nhóm Bảng dữ liệu (Table)

#### Ví dụ Bảng hiển thị danh sách Đơn hàng:
```tsx
import { Table, TableHeaderCell, TableRow, TableCell } from "@astryxdesign/core/Table";
import { StatusDot } from "@astryxdesign/core/StatusDot";
import { Badge } from "@astryxdesign/core/Badge";

const bookings = [
  { id: 744, customer: "Nguyễn Văn A", amount: "241.600.000 ₫", status: "COMPLETED" },
  { id: 743, customer: "Trần Thị B", amount: "326.600.000 ₫", status: "CANCELLED" },
];

export function BookingTableList() {
  return (
    <Table>
      <thead>
        <TableRow>
          <TableHeaderCell>Mã đơn</TableHeaderCell>
          <TableHeaderCell>Khách hàng</TableHeaderCell>
          <TableHeaderCell>Tổng tiền</TableHeaderCell>
          <TableHeaderCell>Trạng thái</TableHeaderCell>
        </TableRow>
      </thead>
      <tbody>
        {bookings.map((row) => (
          <TableRow key={row.id}>
            <TableCell>#{row.id}</TableCell>
            <TableCell>{row.customer}</TableCell>
            <TableCell>{row.amount}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <StatusDot
                  variant={row.status === "COMPLETED" ? "success" : "error"}
                  label={row.status}
                />
                <Badge label={row.status} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </tbody>
    </Table>
  );
}
```

---

### 3.6. Nhóm Thống báo & Cảnh báo (Banner & Toast)

#### Ví dụ Banner cảnh báo sự cố:
```tsx
import { Banner } from "@astryxdesign/core/Banner";

export function SystemNotice() {
  return (
    <Banner
      status="error"
      title="Lỗi kết nối máy chủ"
      description="Không thể đồng bộ dữ liệu booking từ hệ thống backend. Vui lòng thử lại sau."
      isDismissable
      onDismiss={() => console.log("Dismissed")}
    />
  );
}
```

---

## 4. Tóm tắt Đường dẫn Import Phổ biến

```tsx
// Shell & Layout
import { AppShell } from "@astryxdesign/core/AppShell";
import { SideNav, SideNavItem, SideNavSection, SideNavHeading } from "@astryxdesign/core/SideNav";
import { TopNav, TopNavHeading } from "@astryxdesign/core/TopNav";
import { Layout, LayoutContent, LayoutHeader, LayoutFooter, LayoutPanel } from "@astryxdesign/core/Layout";
import { VStack, HStack, Grid } from "@astryxdesign/core/Stack";

// Components
import { Button, IconButton } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { Badge } from "@astryxdesign/core/Badge";
import { StatusDot } from "@astryxdesign/core/StatusDot";
import { Heading, Text } from "@astryxdesign/core/Text";
import { Selector } from "@astryxdesign/core/Selector";
import { TextInput } from "@astryxdesign/core/TextInput";
import { Table, TableRow, TableCell, TableHeaderCell } from "@astryxdesign/core/Table";
import { Banner } from "@astryxdesign/core/Banner";
```
