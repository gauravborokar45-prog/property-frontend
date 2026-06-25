import { ShieldCheck, Clock, Headphones } from "lucide-react";

const InfoSection = () => {
  return (
    <section className="text-center py-24 px-6 bg-gradient-to-b from-gray-50 to-white">
      {/* Heading */}
      <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 text-gray-900">
        Why Rent with <span className="text-indigo-600">YouShell?</span>
      </h2>
      <p className="text-gray-600 mb-16 max-w-2xl mx-auto text-lg">
        Experience reliable, hassle-free renting with verified properties, instant booking, and dedicated support—trusted by thousands of renters.
      </p>

      {/* Features Grid */}
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {/* Feature 1 */}
        <div className="bg-white shadow-md rounded-3xl p-8 hover:shadow-xl transition duration-300 border border-gray-100">
          <div className="flex justify-center mb-4">
            <ShieldCheck className="w-14 h-14 text-indigo-600" />
          </div>
          <h3 className="font-semibold text-xl text-gray-900">Verified Properties</h3>
          <p className="text-sm text-gray-500 mt-2">
            Every property is carefully vetted and verified to ensure a secure and trustworthy renting experience.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="bg-white shadow-md rounded-3xl p-8 hover:shadow-xl transition duration-300 border border-gray-100">
          <div className="flex justify-center mb-4">
            <Clock className="w-14 h-14 text-green-600" />
          </div>
          <h3 className="font-semibold text-xl text-gray-900">Quick Booking</h3>
          <p className="text-sm text-gray-500 mt-2">
            Book your ideal room instantly with a seamless and transparent booking process.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="bg-white shadow-md rounded-3xl p-8 hover:shadow-xl transition duration-300 border border-gray-100">
          <div className="flex justify-center mb-4">
            <Headphones className="w-14 h-14 text-pink-600" />
          </div>
          <h3 className="font-semibold text-xl text-gray-900">24/7 Support</h3>
          <p className="text-sm text-gray-500 mt-2">
            Our friendly and professional support team is available around the clock to assist you anytime.
          </p>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
