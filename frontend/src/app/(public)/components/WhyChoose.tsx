"use client";
import Image from "next/image";

import ch1 from "../../../../public/assets/images/ch1.gif";
import ch2 from "../../../../public/assets/images/ch2.gif";
import ch3 from "../../../../public/assets/images/ch3.gif";
import ch4 from "../../../../public/assets/images/ch4.gif";
import ch5 from "../../../../public/assets/images/ch5.gif";

export default function WhyChoose() {
  return (
    <section className="pt-5 pb-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Item 1 */}
          <div className="flex flex-col items-center gap-4">
            <Image src={ch1} alt="Delivery" width={75} height={75} />
            <div className="text-center">
              <h4 className="font-semibold text-lg text-black">Cruelty Free</h4>
              <p className="text-sm text-gray-500">Never tested on animals</p>
            </div>
          </div>

          {/* Item 2 */}
          <div className="flex flex-col items-center gap-4">
            <Image src={ch2} alt="Payment" width={75} height={75} />
            <div className="text-center">
              <h4 className="font-semibold text-lg text-black">No Parabens</h4>
              <p className="text-sm text-gray-500">
                Free from harsh preservatives
              </p>
            </div>
          </div>

          {/* Item 3 */}
          <div className="flex flex-col items-center gap-4">
            <Image src={ch3} alt="Discount" width={75} height={75} />
            <div className="text-center">
              <h4 className="font-semibold text-lg text-black">No Sulphate</h4>
              <p className="text-sm text-gray-500">Gentle on skin & hair</p>
            </div>
          </div>

          {/* Item 4 */}
          <div className="flex flex-col items-center gap-4">
            <Image src={ch4} alt="Support" width={75} height={75} />
            <div className="text-center">
              <h4 className="font-semibold text-lg text-black">Vegan</h4>
              <p className="text-sm text-gray-500">
                Made with plant-based ingredients
              </p>
            </div>
          </div>

          {/* Item 5 */}
          <div className="flex flex-col items-center gap-4">
            <Image src={ch5} alt="Support" width={75} height={75} />
            <div className="text-center">
              <h4 className="font-semibold text-lg text-black">
                No Phthalates
              </h4>
              <p className="text-sm text-gray-500">
                Safe & toxin-free formulation
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}