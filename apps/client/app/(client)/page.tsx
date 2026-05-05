import Image from "next/image";
import SearchField from "@/components/ui/SearchField";
import TourCard from "@/components/ui/TourCard";
import SectionTitle from "@/components/ui/SectionTitle";
import Thumbnail from "@/components/home/HeroSlider";
import HeroSlider from "@/components/home/HeroSlider";
import ListSlider from "@/components/ui/ListSlider";
import Tabs from "@/components/ui/Tab";
import DestinationGrid from "@/components/home/DestinationCard";
import CategoryCard from "@/components/home/Category";
import SeeAllButton from "@/components/ui/SeeAllButton";
import BlogCardSection from "@/components/home/BlogCard";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <header className="relative w-full flex flex-col items-center">
        {/* Background Banner */}
        <div className="relative w-full h-[260px] md:h-[420px] z-0">
          <Image
            src="/images/demo_banner.jpg"
            alt="banner"
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        {/* Search Bar Container */}
        <div className="relative md:absolute  md:-bottom-24 md:left-1/2 md:-translate-x-1/2 container-main w-full z-30 font-body px-4 md:px-0 -mt-20 md:mt-0">
          <div className="bg-surface/80 backdrop-blur-2xl rounded-4xl md:rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] border border-white/50 p-2 md:p-3">
            {/* 1. Tabs Menu - Thiết kế lại dạng Pill Tab */}
            <div className="flex items-center gap-2 px-2 py-1 mb-1 overflow-x-auto no-scrollbar justify-start md:justify-center">
              {[
                { icon: "local_activity", label: "Visa", active: false },
                { icon: "grid_view", label: "Tour trọn gói", active: true },
                { icon: "hotel", label: "Khách sạn", active: false },
                { icon: "flight", label: "Vé máy bay", active: false },
                { icon: "directions_car", label: "Combo", active: false },
                { icon: "add_circle", label: "Dịch vụ khác", active: false },
              ].map((tab, idx) => (
                <button
                  key={idx}
                  className={`flex items-center gap-2 px-4 md:px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap flex-none ${
                    tab.active
                      ? "bg-primary text-white shadow-md shadow-primary/20 scale-105"
                      : "text-gray-500 hover:bg-surface/50 hover:text-primary"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {tab.icon}
                  </span>
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="bg-surface rounded-3xl md:rounded-[2.5rem] p-1.5 flex flex-col md:flex-row items-center gap-1.5 shadow-inner border border-gray-50">
              {/* Search Groups */}
              <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-1 relative">
                {/* Điểm đến */}
                <div className="relative group px-5 md:px-7 py-2 md:py-3 rounded-2xl transition-all duration-300 hover:bg-blue-50/50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary/60 group-hover:text-primary transition-colors">
                      location_on
                    </span>
                    <SearchField
                      label="Bạn muốn đi đâu? *"
                      placeholder="ví dụ: Đà Nẵng, Phú Quốc..."
                    />
                  </div>
                  {/* Subtle Vertical Divider */}
                  <div className="hidden md:block absolute right-0 top-1/4 h-1/2 w-px bg-linear-to-b from-transparent via-gray-200 to-transparent"></div>
                  {/* Horizontal Divider for mobile */}
                  <div className="block md:hidden absolute bottom-0 left-1/4 w-1/2 h-px bg-linear-to-r from-transparent via-gray-200 to-transparent"></div>
                </div>

                {/* Ngày đi */}
                <div className="relative group px-5 md:px-7 py-2 md:py-3 rounded-2xl transition-all duration-300 hover:bg-blue-50/50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary/60 group-hover:text-primary transition-colors">
                      calendar_month
                    </span>
                    <SearchField
                      label="Ngày đi"
                      placeholder="Chọn ngày khởi hành"
                    />
                  </div>
                  <div className="hidden md:block absolute right-0 top-1/4 h-1/2 w-px bg-linear-to-b from-transparent via-gray-200 to-transparent"></div>
                  <div className="block md:hidden absolute bottom-0 left-1/4 w-1/2 h-px bg-linear-to-r from-transparent via-gray-200 to-transparent"></div>
                </div>

                {/* Ngân sách */}
                <div className="relative group px-5 md:px-7 py-2 md:py-3 rounded-2xl transition-all duration-300 hover:bg-blue-50/50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary/60 group-hover:text-primary transition-colors">
                      payments
                    </span>
                    <SearchField
                      label="Ngân sách"
                      placeholder="Mức giá mong muốn"
                      isSelect
                    />
                  </div>
                </div>
              </div>

              {/* Nút Tìm kiếm - Nút Tròn đặc biệt */}
              <button className="w-full md:w-[64px] h-12 md:h-[64px] mt-2 md:mt-0 bg-primary text-white rounded-2xl md:rounded-3xl flex items-center justify-center transition-all duration-500 hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/40 active:scale-95 group relative overflow-hidden gap-2">
                <div className="absolute inset-0 bg-surface/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="material-symbols-outlined text-2xl md:text-3xl z-10">
                  search
                </span>
                <span className="block md:hidden font-bold z-10">Tìm kiếm</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      <div className="h-28"></div>
      <HeroSlider />
      <div className="h-28"></div>
      <section className="wrapper-surface">
        <div className="container-main">
          <SectionTitle
            align="text-left"
            title="Trải Nghiệm Theo Phong Cách"
            description="Khám phá những hành trình được thiết kế theo từng phong cách riêng, từ nghỉ dưỡng thư giãn đến khám phá đầy trải nghiệm, giúp bạn dễ dàng tìm thấy chuyến đi phù hợp nhất."
          ></SectionTitle>
          <ListSlider>
            <CategoryCard
              title="Tour trải nghiệm cao cấp"
              image="/images/demo.png"
              href="/abc"
            />
            <CategoryCard
              title="Tour trải nghiệm cao cấp"
              image="/images/demo.png"
              href="/abc"
            />
            <CategoryCard
              title="Tour trải nghiệm cao cấp"
              image="/images/demo.png"
              href="/abc"
            />
            <CategoryCard
              title="Tour trải nghiệm cao cấp"
              image="/images/demo.png"
              href="/abc"
            />
            <CategoryCard
              title="Tour trải nghiệm cao cấp"
              image="/images/demo.png"
              href="/abc"
            />
            <CategoryCard
              title="Tour trải nghiệm cao cấp"
              image="/images/demo.png"
              href="/abc"
            />
            <CategoryCard
              title="Tour trải nghiệm cao cấp"
              image="/images/demo.png"
              href="/abc"
            />
            <CategoryCard
              title="Tour trải nghiệm cao cấp"
              image="/images/demo.png"
              href="/abc"
            />
            <CategoryCard
              title="Tour trải nghiệm cao cấp"
              image="/images/demo.png"
              href="/abc"
            />
            <CategoryCard
              title="Tour trải nghiệm cao cấp"
              image="/images/demo.png"
              href="/abc"
            />
          </ListSlider>
        </div>
        {/* <CategoryCardSection /> */}
      </section>
      {/* Tour card */}
      <section className="wrapper-surface-low ">
        <div className="container-main">
          <SectionTitle
            align="text-left"
            title="Tour Hot giá rẻ"
            description="Khám phá những hành trình được tuyển chọn kỹ lưỡng với mức giá ưu đãi hấp dẫn. Từ nghỉ dưỡng sang trọng đến trải nghiệm khám phá độc đáo, tất cả đều sẵn sàng để mang đến cho bạn chuyến đi trọn vẹn và đáng nhớ."
          />
          <ListSlider>
            <TourCard
              id="tour-1"
              image="/images/demo.png"
              category="Văn Hóa"
              title="Hành trình Di sản Miền Trung"
              duration="4 Ngày 3 Đêm"
              price="5,525,000"
              location="Đà Nẵng - Hội An"
              description="Khám phá vẻ đẹp di sản văn hóa thế giới tại miền Trung Việt Nam với lịch trình hấp dẫn."
            />

            <TourCard
              id="tour-2"
              image="/images/demo.png"
              category="Khám Phá"
              title="Khám phá Sapa Mù Sương"
              duration="3 Ngày 2 Đêm"
              price="3,290,000"
              location="Lào Cai"
              description="Chinh phục đỉnh Fansipan và trải nghiệm văn hóa bản địa đặc sắc tại bản Cát Cát."
            />

            <TourCard
              id="tour-3"
              image="/images/demo.png"
              category="Nghỉ Dưỡng"
              title="Thiên đường Đảo Ngọc Phú Quốc"
              duration="3 Ngày 2 Đêm"
              price="4,890,000"
              location="Kiên Giang"
              description="Tận hưởng bãi biển xanh ngắt và những khu nghỉ dưỡng sang trọng bậc nhất."
            />

            <TourCard
              id="tour-4"
              image="/images/demo.png"
              category="Nước Ngoài"
              title="Mùa Thu Châu Âu: Pháp - Đức - Ý - Thụy Sĩ"
              duration="10 Ngày 9 Đêm"
              price="69,990,000"
              location="Châu Âu"
              description="Hành trình đi qua những thành phố lãng mạn nhất thế giới trong sắc thu vàng quyến rũ."
            />
            <TourCard
              id="tour-5"
              image="/images/demo.png"
              category="Nước Ngoài"
              title="Mùa Thu Châu Âu: Pháp - Đức - Ý - Thụy Sĩ"
              duration="10 Ngày 9 Đêm"
              price="69,990,000"
              location="Châu Âu"
              description="Hành trình đi qua những thành phố lãng mạn nhất thế giới trong sắc thu vàng quyến rũ."
            />
            <TourCard
              id="tour-6"
              image="/images/demo.png"
              category="Nước Ngoài"
              title="Mùa Thu Châu Âu: Pháp - Đức - Ý - Thụy Sĩ"
              duration="10 Ngày 9 Đêm"
              price="69,990,000"
              location="Châu Âu"
              description="Hành trình đi qua những thành phố lãng mạn nhất thế giới trong sắc thu vàng quyến rũ."
            />
            <TourCard
              id="tour-4"
              image="/images/demo.png"
              category="Nước Ngoài"
              title="Mùa Thu Châu Âu: Pháp - Đức - Ý - Thụy Sĩ"
              duration="10 Ngày 9 Đêm"
              price="69,990,000"
              location="Châu Âu"
              description="Hành trình đi qua những thành phố lãng mạn nhất thế giới trong sắc thu vàng quyến rũ."
            />
          </ListSlider>
        </div>
      </section>
      {/* Featured Destinations */}
      <section className="wrapper-surface">
        <div className="container-main">
          <SectionTitle
            align="text-center mx-auto"
            title="Điểm đến hàng đầu"
            description="Khám phá những điểm đến được yêu thích nhất với cảnh đẹp ấn tượng, trải nghiệm đa dạng và hành trình phù hợp cho mọi du khách."
          />
          <Tabs />
          <DestinationGrid />
        </div>
      </section>
      {/* Blog */}
      <section className="wrapper-surface-low">
        <div className="container-main">
          <SectionTitle
            align="text-center mx-auto"
            title="Hành Trình & Câu Chuyện"
            description="Khám phá những câu chuyện du lịch đầy cảm hứng và lưu giữ những khoảnh khắc đáng nhớ trên mỗi hành trình."
          />
          <BlogCardSection />
          <SeeAllButton href="/abc" className="" label="Xem tất cả" />
        </div>
      </section>
    </>
  );
}
