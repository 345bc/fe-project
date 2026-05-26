"use client"
import { useEffect, useState } from "react";
import itineraryService from "@/services/itinerary-service"
import { ChevronDown } from "lucide-react";
import { div } from "framer-motion/client";

interface RuleAndNoteItem {
    title: string;
    description: string;
}

const ruleAndNotes: RuleAndNoteItem[] = [
    {
        title: "Giá tour bao gồm",
        description: "Vé máy bay khứ hồi theo chương trình, xe du lịch đời mới máy lạnh chất lượng cao suốt tuyến. Khách sạn tiêu chuẩn 3-4 sao trung tâm tiện lợi mua sắm. Các bữa ăn cao cấp theo thực đơn đặc sản địa phương..."
    },
    {
        title: "Giá tour không bao gồm",
        description: "Chi phí cá nhân (giặt ủi, nước uống trong phòng, mua sắm...), vé tham quan ngoài chương trình tự túc. Tiền tip bắt buộc cho Hướng dẫn viên và Tài xế..."
    },
    {
        title: "Lưu ý giá trẻ em",
        description: "Trẻ em dưới 2 tuổi: 30% giá người lớn... Trẻ em từ 2 đến dưới 11 tuổi: 85% giá người lớn... Trẻ em từ 11 tuổi trở lên: Tính giá như người lớn..."
    },
    {
        title: "Điều kiện thanh toán",
        description: "Đợt 1: Đặt cọc 50% tổng giá trị tour ngay khi đăng ký... Đợt 2: Thanh toán phần còn lại 10 ngày trước ngày khởi hành..."
    },
    {
        title: "Điều kiện đăng ký",
        description: "Hộ chiếu còn thời hạn sử dụng tối thiểu 6 tháng... Phụ nữ có thai hoặc người cao tuổi từ 70 tuổi trở lên cần có giấy xác nhận sức khỏe..."
    },
    {
        title: "Lưu ý về chuyển hoặc hủy tour",
        description: "Tất cả yêu cầu thay đổi lịch trình hoặc hủy tour phải được gửi bằng văn bản chính thức..."
    },
    {
        title: "Các điều kiện hủy tour đối với ngày thường",
        description: "Hủy trước 30 ngày khởi hành: Miễn phí... Hủy trong vòng 7 ngày trước khởi hành: Phí huỷ 100%..."
    },
    {
        title: "Các điều kiện hủy tour đối với ngày lễ, Tết",
        description: "Hủy trước 45 ngày khởi hành: Phí huỷ 20%... Hủy trong vòng 10 ngày trước khởi hành: Phí huỷ 100%..."
    }
];
export default function RuleAndNoteSection() {
    const [ruleandnote, setruleandnote] = useState<RuleAndNoteItem[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setruleandnote(ruleAndNotes)
    })

    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="rounded-3xl bg-surface px-4">
            <div
                className="relative group:">
                {ruleandnote.map((item, index) => (
                    <div key={index} className="border-b border-slate-300 ">
                        <div onClick={() => toggle(index)} className="flex justify-between  font-sans text-base font-bold text-text-primary items-center p-4 md:p-5 cursor-pointer  select-none transition">
                            <h3 className={`text-sm md:text-sm font-bold  pt-1 transition-colors duration-300 ${openIndex === index ? "text-primary" : ""}`}>
                                {item.title}
                            </h3>
                            <ChevronDown
                                size={16}
                                className={`text-slate-400 transition-transform duration-200 shrink-0 ${openIndex === index ? "rotate-180" : ""
                                    }`}
                            />
                        </div>
                        <div
                            className={`overflow-hidden transition-all duration-300 ${openIndex === index ? "max-h-[500px] p-4" : "max-h-0"
                                }`}
                        >
                            <p className="text-text-secondary font-sans text-sm font-medium">{item.description}</p>
                        </div>
                    </div>

                ))}
            </div>
        </div>
    );

}