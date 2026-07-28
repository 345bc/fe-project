"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import destinationService from "@/services/destination-service";
import ImageUpload from "@/components/ui/ImageUpload";

export default function AddDestinationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [introduce, setIntroduce] = useState("");
  const [image, setImage] = useState("");
  const [groupId, setGroupId] = useState("");

  // Destination Groups options state
  const [groups, setGroups] = useState<any[]>([]);
  const [fetchingGroups, setFetchingGroups] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await destinationService.getAllDestinationGroups();
        setGroups(data || []);
      } catch (err: any) {
        console.error("Lỗi tải danh sách nhóm địa điểm:", err);
        setError("Không thể tải danh sách nhóm địa điểm du lịch.");
      } finally {
        setFetchingGroups(false);
      }
    };
    fetchGroups();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!image) {
      setError("Vui lòng tải ảnh lên trước khi lưu.");
      return;
    }
    if (!groupId) {
      setError("Vui lòng chọn Nhóm địa điểm.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await destinationService.postDestination({
        name,
        introduce,
        image,
        groupId: Number(groupId),
      });
      router.push("/destinations");
    } catch (err: any) {
      setError(err?.message || "Thêm điểm đến mới thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingGroups) {
    return (
      <div className="space-y-5">
        <div className="h-7 w-48 animate-pulse rounded-md bg-gray-200" />
        <div className="h-96 w-full animate-pulse rounded-xl bg-gray-100" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Thêm Điểm đến mới</h1>
        <p className="mt-1 text-sm text-gray-500">Tạo điểm du lịch mới trong cơ sở dữ liệu</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p className="font-medium">Lỗi</p>
          <p className="mt-1 text-red-600">{error}</p>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white max-w-3xl">
        <form onSubmit={handleSubmit}>
          <div className="space-y-5 px-6 py-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Tên Điểm đến</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Đảo Phú Quốc, Vịnh Hạ Long,..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Nhóm địa điểm du lịch</label>
              <select
                required
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-gray-900 focus:outline-none"
              >
                <option value="">-- Chọn nhóm địa điểm --</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Giới thiệu ngắn gọn</label>
              <textarea
                value={introduce}
                onChange={(e) => setIntroduce(e.target.value)}
                required
                rows={4}
                placeholder="Giới thiệu đôi nét nổi bật về điểm đến này..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none resize-y"
              />
            </div>

            <ImageUpload value={image} onChange={setImage} label="Ảnh đại diện Điểm đến" />
          </div>

          <div className="h-px bg-gray-200" />
          <div className="flex justify-end gap-3 px-6 py-4">
            <button
              type="button"
              onClick={() => router.push("/destinations")}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
