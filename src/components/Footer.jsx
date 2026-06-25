const Footer = () => {
    return (
      <footer className="bg-gray-900 text-white py-10 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
              YouShell
            </h3>
            <p className="text-sm text-gray-400">Making room hunting simple and stress-free for everyone.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Quick Links</h4>
            <ul className="space-y-1 text-sm text-gray-400">
              <li><a href="#">Properties</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Help</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">For Owners</h4>
            <ul className="space-y-1 text-sm text-gray-400">
              <li><a href="#">List Property</a></li>
              <li><a href="#">Owner Dashboard</a></li>
              <li><a href="#">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Support</h4>
            <ul className="space-y-1 text-sm text-gray-400">
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-500">
          © 2024 RoomFinder. All rights reserved.
        </div>
      </footer>
    );
  };
  
  export default Footer;
  