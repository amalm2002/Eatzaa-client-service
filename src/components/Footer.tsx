
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, ArrowUp } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">FoodDelivery</h3>
            <p className="text-gray-600 mb-4">Experience the ultimate food delivery service with a wide variety of restaurants to choose from.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-600 hover:text-primary transition-colors">My Account</Link>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors">About Us</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors">Offers & Discounts</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors">Restaurants Near Me</a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors">Help Center</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors">FAQs</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors">Restaurant Registration</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <span className="text-gray-600">123 Food Street, Foodville, NY 10001</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                <span className="text-gray-600">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                <span className="text-gray-600">support@fooddelivery.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Download App Section */}
        <div className="border-t border-b py-8 my-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-lg font-semibold mb-2">Download Our Mobile App</h3>
            <p className="text-gray-600 mb-4">Get exclusive offers and track your orders in real time</p>
            <div className="flex flex-wrap gap-4">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/2560px-Google_Play_Store_badge_EN.svg.png" 
                alt="Google Play" 
                className="h-10 w-auto"
              />
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/2560px-Download_on_the_App_Store_Badge.svg.png" 
                alt="App Store" 
                className="h-10 w-auto"
              />
            </div>
          </div>
          
          <div className="flex justify-center md:justify-end">
            <img 
              src="https://cdn-icons-png.flaticon.com/512/4616/4616089.png" 
              alt="Mobile App" 
              className="h-40 w-auto"
            />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t">
          <p className="text-gray-600 text-sm mb-4 md:mb-0">© 2025 FoodDelivery. All rights reserved.</p>
          
          <div className="flex items-center gap-2">
            <span className="text-gray-600 text-sm">Back to top</span>
            <button 
              onClick={scrollToTop}
              className="bg-primary text-white h-8 w-8 rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
