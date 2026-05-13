"use client";
import { useEffect, useState } from "react";
import CategoryCard from "./home/Category";
import ListSlider from "./ui/ListSlider";
import categoryService from "@/services/category-service";

const baseURL = "http://localhost:8080";

export type Categories = {
  id: number;
  name: string;
  image: string;
};

export default function CategorySection() {
  const [categories, setCategories] = useState<Categories[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await categoryService.getCategories();
      setCategories(data);
      setLoading(false);
    };
    fetchCategories();
  }, []);

  if (loading)
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );

  return (
    <ListSlider>
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          title={category.name}
          image={`/images/${category.image}`}
          href="/abc"
        />
      ))}
    </ListSlider>
  );
}
