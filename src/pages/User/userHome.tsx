import { useEffect, useState } from "react";
import Navbar from "../../components/user/layouts/Navbar";
import Categories from "../../components/user/home/Categories";
import Hero from "../../components/user/home/Hero";
import RestaurantCard from "../../components/user/home/RestaurantCards";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userApi } from "../../api/endpoints/userApi";

const Index = () => {
  const [menuItems, setMenuItems] = useState([]);
  const dispatch = useDispatch()

  const navigate = useNavigate()

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await userApi.getRestaurantMenus(dispatch)
        setMenuItems(response.data);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };
    fetchMenuItems();
  }, []);

  const handleClick = (item: any) => {
    navigate('/food-list-page')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero />
      <Categories />

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-display font-bold text-center mb-12">
            Popular Dishes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {menuItems.length > 0 ? (
              menuItems.map((item: any) => (
                <RestaurantCard
                  key={item._id}
                  id={item._id}
                  name={item.name || "Unnamed Dish"}
                  restaurant={item.restaurantName}
                  image={
                    item.images && item.images.length > 0
                      ? item.images[0]
                      : "https://via.placeholder.com/150"
                  }
                  rating={item.rating || 4.0}
                  cuisine={item.category || item.restaurantName || "General"}
                  deliveryTime={item.timing || "30-40 min"}
                  minimumOrder={
                    item.price ? `Min $${item.price}` : "Min $10"
                  }
                  opened={item.isOnline === true}
                  onClick={() => handleClick(item)}
                />
              ))
            ) : (
              <p className="text-center text-gray-500">Loading dishes...</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
