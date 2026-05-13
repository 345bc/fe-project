"use client";
import ListSlider from "./ui/ListSlider";
import BlogCard from "./home/BlogCard";
import { useEffect, useState } from "react";
import blogService from "@/services/blog-service";

export type Blogs = {
  id: number;
  title: string;
  contents: string;
  image: string;
  created_at: string;
  views: number;
  summary: string;
  blogCategories: {
    id: number;
    name: string;
    slug: string;
    description: string;
  };
};

const baseURL = "http://localhost:8080";

export default function BlogCardSection() {
  const [blogs, setBlogs] = useState<Blogs[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      const data = await blogService.getBlogs();
      setBlogs(data);
      setLoading(false);
    };
    fetchTours();
  }, []);

  if (loading)
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );

  return (
    <>
      {/* <div className="block md:hidden">
        <ListSlider>
          {blogData.map((blog) => (
            <BlogCard key={blog.id} {...blog} />
          ))}
        </ListSlider>
      </div> */}

      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <BlogCard
            key={blog.id}
            title={blog.title}
            image={`/images/${blog.image}`}
            date={blog.created_at}
            category={blog.blogCategories.name}
            description={blog.summary}
            href={`/blog/${blog.id}`}
          />
        ))}
      </div>
    </>
  );
}
