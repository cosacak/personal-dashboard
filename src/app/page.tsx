import { WeatherWidget } from "@/components/widgets/WeatherWidget";
import { TodoWidget } from "@/components/widgets/TodoWidget";
import { FinanceWidget } from "@/components/widgets/FinanceWidget";
import { NewsWidget } from "@/components/widgets/NewsWidget";

export default function Home() {
  const now = new Date();
  const greeting =
    now.getHours() < 12
      ? "Good morning"
      : now.getHours() < 18
      ? "Good afternoon"
      : "Good evening";

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{greeting} 👋</h1>
        <p className="text-sm text-gray-500 mt-1">
          {now.toLocaleDateString("en-GB", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </header>

      {/* Dashboard Grid: 3 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-130px)]">
        {/* Left Column — Finance */}
        <div className="lg:col-span-1 min-h-0">
          <FinanceWidget />
        </div>

        {/* Center Column — Weather + News */}
        <div className="lg:col-span-1 flex flex-col gap-6 min-h-0">
          <WeatherWidget />
          <div className="flex-1 overflow-hidden">
            <NewsWidget />
          </div>
        </div>

        {/* Right Column — Todo */}
        <div className="lg:col-span-1 min-h-0">
          <TodoWidget />
        </div>
      </div>
    </div>
  );
}
