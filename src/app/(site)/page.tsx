import { Hero } from "@/components/home/hero";
import { StorySection } from "@/components/home/story-section";
import { FeaturedDishes } from "@/components/home/featured-dishes";
import { HoursLocation } from "@/components/home/hours-location";
import { ReviewsCarousel } from "@/components/home/reviews-carousel";
import { getMenuCategoriesWithItems } from "@/lib/data/menu";
import { getPublishedReviews } from "@/lib/data/reviews";

export const revalidate = 60;

export default async function Home() {
  const [categories, reviews] = await Promise.all([
    getMenuCategoriesWithItems(),
    getPublishedReviews(),
  ]);

  const featuredItems = categories
    .flatMap((c) => c.items)
    .filter((item) => item.is_new || item.seasonal)
    .slice(0, 3);

  return (
    <>
      <Hero />
      <StorySection />
      <FeaturedDishes items={featuredItems} />
      <HoursLocation />
      <ReviewsCarousel reviews={reviews} />
    </>
  );
}
