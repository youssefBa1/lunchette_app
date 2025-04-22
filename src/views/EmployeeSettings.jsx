import EmployeeManagement from "../components/SettingsComponents/EmployeeManagement";

const EmployeeSettings = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <EmployeeManagement />
        </div>
      </div>
    </div>
  );
};

export default EmployeeSettings;
