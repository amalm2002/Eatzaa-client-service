import Navbar from "../../components/Navbar";
import Categories from '../../components/Categories'
import Hero from "../../components/Hero";
import RestaurantCard from "../../components/Restaurant";


const restaurants = [
  {
    name: "Pizza Paradise",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
    rating: 4.5,
    cuisine: "Italian • Pizza • Pasta",
    deliveryTime: "25-30 min",
    minimumOrder: "Min $15"
  },
  {
    name: "Burger House",
    image: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
    rating: 4.2,
    cuisine: "American • Burgers • Fries",
    deliveryTime: "20-25 min",
    minimumOrder: "Min $10"
  },
  {
    name: "Sushi Master",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
    rating: 4.8,
    cuisine: "Japanese • Sushi • Asian",
    deliveryTime: "30-35 min",
    minimumOrder: "Min $20"
  },
  {
    name: "Taco Fiesta",
    image: "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f",
    rating: 4.4,
    cuisine: "Mexican • Tacos • Burritos",
    deliveryTime: "25-30 min",
    minimumOrder: "Min $12"
  },
  {
    name: "Green Bowl",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
    rating: 4.6,
    cuisine: "Healthy • Salads • Bowls",
    deliveryTime: "20-25 min",
    minimumOrder: "Min $15"
  },
  {
    name: "Curry House",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe",
    rating: 4.3,
    cuisine: "Indian • Curry • Naan",
    deliveryTime: "30-35 min",
    minimumOrder: "Min $18"
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero />
      <Categories />
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-display font-bold text-center mb-12">
            Popular Restaurants
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {restaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.name}
                {...restaurant}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
