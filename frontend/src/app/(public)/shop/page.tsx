import InnerBanner from "../components/InnerBanner";
import ShopCategory from "../components/ShopCategory";
import bannerImg from "../../../../public/assets/shopimg/shop-banner.jpeg";



export default function ShopPage() {
  return (
    <>
      <main>
        <InnerBanner title="Shop" image={bannerImg} />
       <ShopCategory />
      </main>
    </>
  );
}