import InnerBanner from "../components/InnerBanner";
import innerBanner from "../../../../public/assets/images/innerBanner.webp";
import AboutInner from "../components/about/AboutInner";
import WhyChoose from "../components/WhyChoose";
import InstagramFeed from "../components/InstagramFeed";


export default function AboutPage() {
  return (
    <>
      <main>
         <InnerBanner title="About Us" image={innerBanner} />
         <AboutInner />
         <InstagramFeed />
         <WhyChoose />
      </main>
    </>
  );
}