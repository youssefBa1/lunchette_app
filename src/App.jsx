import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react";
import Orders from "./views/Orders";
import TeamView from "./views/Team";
import HomeView from "./views/Home";
import Settings from "./views/Settings";
import Categories from "./views/Categories";
import Products from "./views/Products";
import ExpenseCategories from "./views/ExpenseCategories";
import Expenses from "./views/Expenses";
import RegularSales from "./views/RegularSales";
import SupplierExpenses from "./views/SupplierExpenses";
import Suppliers from "./views/Suppliers";
import Accounts from "./views/Accounts";
import NavBar from "./components/NavBar";
import EmployeeSettings from "./views/EmployeeSettings";
import Login from "./views/Login";
import Error from "./views/Error";
import { presenceAutomationService } from "./services/presenceAutomationService";
import ProtectedRoute from "./components/ProtectedRoute";
import authService from "./services/authService";
import MyAccount from "./views/MyAccount";

function App() {
  useEffect(() => {
    // Start the presence automation service
    presenceAutomationService.start();

    // Cleanup on unmount
    return () => {
      presenceAutomationService.stop();
    };
  }, []);

  const ProtectedLayout = ({ children }) => (
    <>
      <NavBar />
      <div className="scale-[0.8] origin-top-left w-[125%]">{children}</div>
    </>
  );

  return (
    <div className="flex flex-col">
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              authService.isAuthenticated() ? (
                <Navigate to={authService.getDefaultRoute()} replace />
              ) : (
                <Login />
              )
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <HomeView />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <Orders />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/team"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <TeamView />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <Settings />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/regular-sales"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <RegularSales />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/categories"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <Categories />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/products"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <Products />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/expenses"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <ExpenseCategories />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/expenses"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <Expenses />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/supplier-expenses"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <SupplierExpenses />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/employees"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <EmployeeSettings />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/suppliers"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <Suppliers />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/accounts"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <Accounts />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/my-account"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <MyAccount />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Error />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
