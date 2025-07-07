import { SidebarProps } from "../../../interfaces/user/authentication/register/sidebar.types";

const Sidebar = ({
  title = 'FoodHub',
  subtitle = 'Taste Excellence',
  description = 'Join our community and explore delightful meals at your convenience.',
  features = ['Quick & easy ordering', 'Exclusive offers', '24/7 Customer support'],
}: SidebarProps) => {
  return (
    <div className="hidden md:flex flex-1 bg-[rgb(60,110,113)] text-white p-12 flex-col justify-center items-center max-h-[85vh]">
      <h2 className="text-3xl font-bold">{title}</h2>
      <h3 className="text-xl mt-2">{subtitle}</h3>
      <p className="mt-4 text-center">{description}</p>
      <ul className="mt-6 space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <span className="text-yellow-300 mr-2">✔</span> {feature}
          </li>
        ))}
      </ul>
      <div className="mt-6 text-sm text-center">
        <p>📍 123 Gourmet Street, Foodville</p>
        <p>📞 +1 (555) 123-4567</p>
      </div>
    </div>
  );
};

export default Sidebar;