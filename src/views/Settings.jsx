import { IonIcon } from "@ionic/react";
import { useNavigate } from "react-router-dom";
import {
  fastFoodOutline,
  pizzaOutline,
  restaurantOutline,
  pricetagsOutline,
  peopleOutline,
  statsChartOutline,
} from "ionicons/icons";

const Settings = () => {
  const navigate = useNavigate();

  const categories = [
    {
      title: "Produits",
      description: "Gérer les produits et leurs options",
      icon: fastFoodOutline,
      color: "bg-rose-50 hover:bg-rose-100",
      path: "/settings/products",
    },
    {
      title: "Catégories",
      description: "Organiser les catégories de produits",
      icon: pizzaOutline,
      color: "bg-rose-50 hover:bg-rose-100",
      path: "/settings/categories",
    },
    {
      title: "Menu",
      description: "Configurer l'affichage du menu",
      icon: restaurantOutline,
      color: "bg-rose-50 hover:bg-rose-100",
      path: "/settings/menu",
    },
    {
      title: "Prix",
      description: "Gérer les prix et les promotions",
      icon: pricetagsOutline,
      color: "bg-rose-50 hover:bg-rose-100",
      path: "/settings/prices",
    },
    {
      title: "Équipe",
      description: "Gérer les membres de l'équipe",
      icon: peopleOutline,
      color: "bg-rose-50 hover:bg-rose-100",
      path: "/settings/team",
    },
    {
      title: "Statistiques",
      description: "Voir les statistiques de vente",
      icon: statsChartOutline,
      color: "bg-rose-50 hover:bg-rose-100",
      path: "/settings/stats",
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-10 px-4 sm:px-6 md:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {categories.map((category, index) => (
          <div
            key={index}
            onClick={() => navigate(category.path)}
            className={`${category.color} p-6 rounded-xl shadow-sm transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md cursor-pointer`}
          >
            <div className="flex items-start space-x-4">
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <IonIcon
                  icon={category.icon}
                  style={{ fontSize: "24px" }}
                  className="text-rose-500"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {category.title}
                </h3>
                <p className="text-gray-600 text-sm">{category.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;
