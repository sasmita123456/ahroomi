import ContactInner from "../components/ContactInner";
import InnerBanner from "../components/InnerBanner";
import contactBanner from "../../../../public/assets/contactusbanner/contactusbanner.jpg"
import WhyChoose from "../components/WhyChoose";

export default function ContactPage() {
  return (
    <>
      <main>
        <InnerBanner title="Contact Us" image={contactBanner} />
       <ContactInner />
       <WhyChoose />
      </main>
    </>
  );
}