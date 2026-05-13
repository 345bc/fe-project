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
import SearchBar from "@/components/search-bar";
import CategorySection from "@/components/category-section";
import TourSection from "@/components/tour-section";

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
        <SearchBar />
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
          <CategorySection />
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
          <TourSection />
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
