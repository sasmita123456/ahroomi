import Image from "next/image";
import { FaInstagram, FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import floar from "../../../../public/assets/contactusbanner/floar.png"

const ContactInner = () => {
  return (
    <>
      {/* ===================== CONTACT SECTION ===================== */}
      <section className="py-16">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-start">
          
          {/* ---------- LEFT INFO ---------- */}
          <div className="relative overflow-hidden">
            {/* FLORAL BACKGROUND */}
            <Image
              src={floar}
              alt="Floral Background"
              width={400}
              height={400}
              className="absolute -top-10 -left-10 w-[340px] opacity-[0.15] pointer-events-none select-none"
            />

            <div className="relative ">
              {/* Accent Line */}
              <div className="absolute -left-6 top-6 w-[3px] h-20 bg-linear-to-b from-transparent to-[#22a6dd] opacity-60 hidden lg:block" />

              <p className="text-xs tracking-[0.3em] text-[#22a6dd] mb-3 uppercase font-semibold">
                Contact Ahroomi
              </p>

              <h2 className="text-4xl md:text-5xl font-serif text-gray-800 mb-5 leading-tight">
                Beauty Begins <br />
                <span className="italic text-[#22a6dd]">With a Conversation</span>
              </h2>

              <p className="text-base text-gray-600 leading-relaxed mb-8 max-w-md">
                At <span className="font-medium text-[#22a6dd]">Ahroomi</span>, we believe beauty is personal. 
                Reach out for guidance, product details, or to connect with us.
              </p>

              {/* Divider */}
              <div className="w-14 h-0.5 bg-linear-to-r from-[#22a6dd] to-transparent mb-8 rounded-full" />

              {/* CONTACT DETAILS */}
              <div className="space-y-5 text-gray-700 text-md">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-[#22a6dd]/10 flex items-center justify-center mr-4 shrink-0">
                    <svg className="w-5 h-5 text-[#22a6dd]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs tracking-widest text-gray-500 uppercase mb-1">
                      Visit Us
                    </p>
                    <p>
                      4th Floor, Galaxy Mall, Raghunathpur,<br />
                      Bhubaneswar – 751024
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-[#22a6dd]/10 flex items-center justify-center mr-4 shrink-0">
                    <svg className="w-5 h-5 text-[#22a6dd]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs tracking-widest text-gray-500 uppercase mb-1">
                      Email
                    </p>
                    <p>ahroomi@aashdit.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-[#22a6dd]/10 flex items-center justify-center mr-4 shrink-0">
                    <svg className="w-5 h-5 text-[#22a6dd]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs tracking-widest text-gray-500 uppercase mb-1">
                      Phone
                    </p>
                    <p>+91-8327729174</p>
                  </div>
                </div>
              </div>

              {/* SOCIAL */}
              <div className="mt-5">
                <p className="text-xs tracking-widest text-gray-500 uppercase mb-2">
                  Follow Us
                </p>
                <div className="flex gap-4 py-2">
                  {[FaLinkedinIn, FaFacebookF, FaInstagram].map((Icon, i) => (
                    <span
                      key={i}
                      className="w-10 h-10 flex shadow-sm items-center justify-center rounded-full
                                 bg-white  text-gray-700
                                 hover:bg-[#22a6dd] hover:text-white hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                    >
                      <Icon size={16} />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ---------- FORM CARD ---------- */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100 relative overflow-hidden">
            {/* Decorative element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-[#22a6dd]/10 to-transparent rounded-bl-full"></div>
            
            <h3 className="text-2xl font-serif text-gray-800 mb-8 relative">
              Get in Touch
            </h3>
            
            <form className="space-y-6 relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#22a6dd]/50 focus:border-[#22a6dd] focus:outline-none transition-all duration-300"
                />
                <div className="absolute left-0 bottom-0 h-0.5 w-0 bg-[#22a6dd] transition-all duration-300 focus-within:w-full"></div>
              </div>
              
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#22a6dd]/50 focus:border-[#22a6dd] focus:outline-none transition-all duration-300"
                />
                <div className="absolute left-0 bottom-0 h-0.5 w-0 bg-[#22a6dd] transition-all duration-300 focus-within:w-full"></div>
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="Contact Number"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#22a6dd]/50 focus:border-[#22a6dd] focus:outline-none transition-all duration-300"
                />
                <div className="absolute left-0 bottom-0 h-0.5 w-0 bg-[#22a6dd] transition-all duration-300 focus-within:w-full"></div>
              </div>

              <div className="relative">
                <textarea
                  rows={4}
                  placeholder="Your Message"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#22a6dd]/50 focus:border-[#22a6dd] focus:outline-none resize-none transition-all duration-300"
                ></textarea>
                <div className="absolute left-0 bottom-0 h-0.5 w-0 bg-[#22a6dd] transition-all duration-300 focus-within:w-full"></div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-linear-to-r from-[#22a6dd] to-[#1a8cc4] text-white text-xs tracking-widest uppercase font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="pb-10">
        <div className="map px-4">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3740.6582138674667!2d85.83138637513751!3d20.355733610554346!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a1909820a338d21%3A0xaed0424d3baaa08e!2sAashdit%20Nutritech%20Pvt.%20Ltd.!5e0!3m2!1sen!2sin!4v1765286811218!5m2!1sen!2sin" 
              width="100%" 
              height="300" 
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
              title="Ahroomi Studio Location"
            />

        </div>
      </section>
    </>
  );
};

export default ContactInner;