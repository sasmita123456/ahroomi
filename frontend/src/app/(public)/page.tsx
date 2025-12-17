import { products } from "./data/products";
import { categoryProducts } from "./data/categories";
import { instagramPosts } from "./data/instagramfeed";
import Banner from "./components/Banner";
import CategoryGrid from "./components/CategoryGrid";
import OfferInfo from "./components/OfferInfo";
import FeaturedProducts from "./components/FeaturedProducts";
import TopSelling from "./components/TopSelling";
import Testimonials from "./components/Testimonials";
import Newsletter from "./components/Newsletter";
import WhyChoose from "./components/WhyChoose";
import InstagramFeed from "./components/InstagramFeed";
import MScience from "./components/MScience";

export default function HomePage() {
  const featured = products.filter((p) => p.featured);
  return (
    <>
      <main>
        <Banner />
        <CategoryGrid />
        <FeaturedProducts items={featured} />
        <MScience />
        <OfferInfo />
        <TopSelling items={categoryProducts} />
        <Testimonials />
        <Newsletter />
        <InstagramFeed posts={instagramPosts} />
        <WhyChoose />
      </main>
    </>
  );
}