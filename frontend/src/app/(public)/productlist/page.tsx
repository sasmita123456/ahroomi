import InnerBanner from "../components/InnerBanner";

import bannerImg from "../../../../public/assets/shopimg/shop-banner-2.jpeg";
import ProductList from "../components/ProductList";



export default function ProductListPage() {
  return (
    <>
      <main>
        <InnerBanner title="Product List" image={bannerImg} />
        <ProductList />
      </main>
    </>
  );
}