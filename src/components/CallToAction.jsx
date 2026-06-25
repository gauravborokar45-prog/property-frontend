import { useNavigate } from "react-router-dom";

const CallToAction = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-blue-600 text-white text-center py-16 px-4">
      <h2 className="text-3xl font-bold mb-3">Ready to Find Your Dream Room?</h2>
      <p className="mb-6 text-lg">
        Join thousands of happy tenants who found their perfect home through RoomFinder
      </p>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => navigate("/all-properties")}
          className="bg-white text-black px-6 py-2 rounded font-medium hover:bg-gray-100"
        >
          Browse Properties
        </button>
        <button
          onClick={() => navigate("/list-property")}
          className="bg-white text-blue-600 border border-blue-600 px-6 py-2 rounded font-medium hover:bg-blue-50"
        >
          List Your Property
        </button>
      </div>
    </section>
  );
};

export default CallToAction;
