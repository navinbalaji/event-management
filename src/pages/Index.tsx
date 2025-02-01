import { Calendar } from "../components/Calendar";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Event Calendar</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your events with drag-and-drop scheduling
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <Calendar />
        </div>
      </div>
    </div>
  );
};

export default Index;