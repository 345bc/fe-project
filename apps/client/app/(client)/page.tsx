import Image from "next/image";
import SectionTitle from "@/components/ui/SectionTitle";
import HeroSlider from "@/components/home/HeroSlider";
import SeeAllButton from "@/components/ui/SeeAllButton";
import SearchBar from "@/components/search-bar";
import CategorySection from "@/components/category-section";
import TourSection from "@/components/tour-section";
import BlogCardSection from "@/components/blog-section";
import TravelMenu from "@/components/drop-down";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <header className="relative w-full flex flex-col items-center">
        {/* Background Banner */}
        <div className="relative w-full h-[260px] md:h-[420px] ">
          <Image
            src="/images/abc-vector.jpg"
            alt="ZTravel Marketing Banner"
            fill
            className="object-fill"
            priority
          />
        </div>


        {/* Search Bar Container */}
        <SearchBar />
      </header>
      <div className="h-28"></div>
      <HeroSlider
        images={[
          "/images/slider-1-clean.jpg",
          "/images/slider-2-clean.jpg",
          "/images/slider-3-clean.jpg",
        ]}
      />
      <div className="h-28"></div>
      {/* <CategoryCardSection /> */}
      <section className="wrapper-surface">
        <div className="container-main">
          <SectionTitle
            align="text-left"
            title="Trải Nghiệm Theo Phong Cách"
            description="Khám phá những hành trình được thiết kế theo từng phong cách riêng, từ nghỉ dưỡng thư giãn đến khám phá đầy trải nghiệm, giúp bạn dễ dàng tìm thấy chuyến đi phù hợp nhất."
          ></SectionTitle>
          <CategorySection />
        </div>
      </section>
      {/* Tour card */}
      <section className="wrapper-surface-low ">
        <div className="container-main">
          <SectionTitle
            align="text-left"
            title="Tour Hot giá rẻ"
            description="Khám phá những hành trình được tuyển chọn kỹ lưỡng với mức giá ưu đãi hấp dẫn. Từ nghỉ dưỡng sang trọng đến trải nghiệm khám phá độc đáo, tất cả đều sẵn sàng để mang đến cho bạn chuyến đi trọn vẹn và đáng nhớ."
          />
          <TourSection />
        </div>
      </section>
      {/* Last minute tour card */}
      <section className="wrapper-surface">
        <div className="container-main">
          <SectionTitle
            align="text-left"
            title="Đừng bỏ lỡ hành trình này"
            description="Những chuyến đi được yêu thích nhất đang sắp hết hạn đặt chỗ. Đừng bỏ lỡ cơ hội trải nghiệm hành trình tuyệt vời cùng bạn bè và gia đình."
          />
          <TourSection />
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
