import { Search } from "lucide-react";
import { Input } from "./ui/input";




const Hero = () => {
    return (
      <div className="relative min-h-[650px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-primary-dark/40">
          <img 
            src="https://images.unsplash.com/photo-1516100882582-96c3a05fe590?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Hero background - elegant food"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/20 to-primary-dark/70"></div>
        </div>
        
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 animate-fade-up text-white">
            Savor the Moment,<br />Delivered with Care
          </h1>
          <p className="text-lg md:text-xl text-primary-light mb-8 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Experience culinary excellence from our handpicked selection of premium restaurants, brought directly to your doorstep
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center max-w-xl mx-auto animate-fade-up bg-white/10 backdrop-blur-md p-4 rounded-xl" style={{ animationDelay: "0.4s" }}>
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search for refined dishes or restaurants"
                className="w-full pl-12 h-12 bg-white/90 backdrop-blur-sm border-primary-light/20 focus:border-secondary"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary" />
            </div>
            {/* <Button className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white" size="lg">
              Discover
            </Button> */}
            <button className="w-full md:w-auto px-6 py-2.5 rounded-2xl  bg-[rgb(60,110,113)] hover:bg-primary/90 text-white" >
                Discover
            </button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">Free Delivery</span>
            <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">Premium Selection</span>
            <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">24/7 Support</span>
          </div>
        </div>
      </div>
    );
  };
  
export default Hero