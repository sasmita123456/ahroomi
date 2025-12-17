import { products } from "../data/products";
import { categoryProducts } from "../data/categories";
import { instagramPosts } from "../data/instagramfeed";
import Banner from "../components/Banner";
import CategoryGrid from "../components/CategoryGrid";
import OfferInfo from "../components/OfferInfo";
import FeaturedProducts from "../components/FeaturedProducts";
import TopSelling from "../components/TopSelling";
import Testimonials from "../components/Testimonials";
import Newsletter from "../components/Newsletter";
import WhyChoose from "../components/WhyChoose";
import InstagramFeed from "../components/InstagramFeed";
import MScience from "../components/MScience";
import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/");
}