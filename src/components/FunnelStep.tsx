import { FunnelData } from "@/lib/sheets";

interface FunnelStepProps {
  data: FunnelData;
  isLast?: boolean;
  className?: string;
  variant?:
    | "total"
    | "new"
    | "existing"
    | "company"
    | "freelance"
    | "experience"
    | "salary";
  index?: number;
}

export default function FunnelStep({
  data,
  isLast = false,
  className = "",
  variant = "new",
  index = 0,
}: FunnelStepProps) {
  const getColors = () => {
    switch (variant) {
      case "total":
        // 全体は赤系統
        return { bg: "bg-red-600", text: "text-red-600" };
      case "new":
      case "existing":
        // ユーザー種別は青系統
        return { bg: "bg-blue-600", text: "text-blue-600" };
      case "company":
      case "freelance":
        // 職業別は紫系統
        return { bg: "bg-purple-600", text: "text-purple-600" };
      case "experience":
        // 経験年数別は緑系統
        return { bg: "bg-emerald-600", text: "text-emerald-600" };
      case "salary":
        // 年収別は橙系統
        return { bg: "bg-orange-600", text: "text-orange-600" };
      default:
        return { bg: "bg-gray-600", text: "text-gray-600" };
    }
  };

  const { bg, text } = getColors();

  if (!data) return null;

  return (
    <div className={`flex flex-col min-w-fit ${className}`}>
      <div className="flex items-center">
        <div className="flex flex-col items-center">
          <div
            className={`w-32 h-32 ${bg} text-white flex items-center justify-center text-center p-3 rounded-lg shadow-md transition-shadow hover:shadow-lg`}
          >
            <div>
              <div className="font-medium text-sm mb-2 opacity-90">
                {data.step}
              </div>
              <div className="text-2xl font-bold">{data.value}</div>
            </div>
          </div>
        </div>
        {!isLast && (
          <div className="flex items-center h-32 px-3 w-20">
            <div className="flex flex-col items-center w-full">
              <div className="text-gray-600 text-sm font-medium mb-1 whitespace-nowrap">
                {data.percentage.toFixed(1)}%
              </div>
              <div className={`text-2xl ${text}`}>→</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
