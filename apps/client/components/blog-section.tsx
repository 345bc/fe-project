import ListSlider from "./ui/ListSlider";
import BlogCard from "./home/BlogCard";

export type Blogs = {
  id: number;
  title: string;
  contents: string;
  image: string;
  created_at: string;
  views: number;
  blogCategories: {
    id: number;
    name: string;
    slug: string;
    description: string;
  };
};

export default function BlogCardSection() {
  const blogData = [
    {
      id: 1,
      category: "Travel",
      date: "30/04",
      title: "Kỳ nghỉ lễ 30/4 rực rỡ tại thành phố biển Vũng Tàu",
      description:
        "Tận hưởng không khí sôi động và những bãi cát trắng trải dài trong dịp lễ lớn nhất năm...",
      image: "/images/demo.png",
    },
    {
      id: 2,
      category: "Food",
      date: "01/05",
      title: "Khám phá ẩm thực đường phố Sài Gòn về đêm",
      description:
        "Những món ăn nóng hổi, tiếng cười nói rôm rả tại các con phố sầm uất nhất...",
      image: "/images/demo.png",
    },
    {
      id: 3,
      category: "Culture",
      date: "02/05",
      title: "Nét đẹp truyền thống trong kiến trúc cổ Hội An",
      description:
        "Bước vào không gian hoài niệm với những bức tường vàng và đèn lồng đa sắc màu...",
      image: "/images/demo.png",
    },
  ];

  return (
    <>
      <div className="block md:hidden">
        <ListSlider>
          {blogData.map((blog) => (
            <BlogCard key={blog.id} {...blog} />
          ))}
        </ListSlider>
      </div>

      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogData.map((blog) => (
          <BlogCard key={blog.id} {...blog} />
        ))}
      </div>
    </>
  );
}
