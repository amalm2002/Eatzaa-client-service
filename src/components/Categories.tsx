
import { Pizza, Coffee, Beer, IceCream, UtensilsCrossed } from "lucide-react";

const categories = [
  {
    name: "Fine Dining",
    icon: UtensilsCrossed,
    color: "bg-primary/20",
    textColor: "text-primary-dark"
  },
  {
    name: "Artisan Coffee",
    icon: Coffee,
    color: "bg-secondary/20",
    textColor: "text-primary-dark"
  },
  {
    name: "Craft Beer",
    icon: Beer,
    color: "bg-accent/20",
    textColor: "text-primary-dark"
  },
  {
    name: "Gourmet Desserts",
    icon: IceCream,
    color: "bg-highlight/20",
    textColor: "text-primary-dark"
  },
  {
    name: "Premium Pizza",
    icon: Pizza,
    color: "bg-cream/70",
    textColor: "text-primary-dark"
  }
];

const Categories = () => {
  return (
    <section className="py-20 bg-cream">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h6 className="text-accent font-medium mb-2">Curated Selection</h6>
        <h2 className="text-3xl font-display font-bold text-primary-dark mb-4">
          Explore Our Categories
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto"></div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
        {categories.map((category) => (
          <button
            key={category.name}
            className="group p-6 rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300 text-center border border-cream-dark"
          >
            <div className={`w-20 h-20 mx-auto rounded-full ${category.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
              <category.icon className={`w-8 h-8 ${category.textColor}`} />
            </div>
            <h3 className="font-display font-medium text-primary-dark">{category.name}</h3>
          </button>
        ))}
      </div>
    </div>
  </section>
  );
};

export default Categories;
