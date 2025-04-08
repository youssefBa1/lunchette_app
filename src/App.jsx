import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Orders from "./views/Orders";
import TeamView from "./views/Team";
import HomeView from "./views/Home";
import Settings from "./views/Settings";
import Categories from "./views/Categories";
import Products from "./views/Products";
import NavBar from "./components/NavBar";

function App() {
  return (
    <div className="flex flex-col">
      <NavBar />
      <div className="scale-[0.8] origin-top-left w-[125%]">
        <Router>
          <>
            <Routes>
              <Route path="/" element={<HomeView></HomeView>}></Route>
              <Route path="/orders" element={<Orders></Orders>}></Route>
              <Route path="/team" element={<TeamView></TeamView>}></Route>
              <Route path="/settings" element={<Settings></Settings>}></Route>
              <Route
                path="/settings/categories"
                element={<Categories></Categories>}
              ></Route>
              <Route
                path="/settings/products"
                element={<Products></Products>}
              ></Route>
            </Routes>
          </>
        </Router>
      </div>
    </div>
  );
}

export default App;
