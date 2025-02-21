import { getFunnelData, type FunnelData, type FunnelSection } from '@/lib/sheets';
import FunnelStep from '@/components/FunnelStep';

export default async function Home() {
  const funnelSections = await getFunnelData();

  const renderSection = (section: FunnelSection) => {
    switch (section.title) {
      case '全体':
        return (
          <div className="relative bg-gray-50/80 rounded-lg p-6 pt-8">
            <div className="overflow-x-auto">
              <div className="flex flex-nowrap items-center gap-1 min-w-max pb-4">
                {section.data.map((data: FunnelData, index: number) => (
                  <FunnelStep
                    key={`total-${data.step}-${index}`}
                    data={data}
                    isLast={index === section.data.length - 1}
                    variant="total"
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case 'ユーザー種別':
        return (
          <div className="grid grid-cols-1 gap-12">
            <div className="relative bg-gray-50/80 rounded-lg p-6 pt-8">
              <h3 className="absolute -top-3 left-4 text-sm font-semibold text-gray-700 bg-white px-2 py-1 rounded border border-gray-200">
                新規ユーザー
              </h3>
              <div className="overflow-x-auto">
                <div className="flex flex-nowrap items-center gap-1 min-w-max pb-4">
                  {section.data.slice(0, 8).map((data: FunnelData, index: number) => (
                    <FunnelStep
                      key={`new-${data.step}-${index}`}
                      data={data}
                      isLast={index === 7}
                      variant="new"
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="relative bg-gray-50/80 rounded-lg p-6 pt-8">
              <h3 className="absolute -top-3 left-4 text-sm font-semibold text-gray-700 bg-white px-2 py-1 rounded border border-gray-200">
                既存ユーザー
              </h3>
              <div className="overflow-x-auto">
                <div className="flex flex-nowrap items-center gap-1 min-w-max pb-4">
                  {section.data.slice(8).map((data: FunnelData, index: number) => (
                    <FunnelStep
                      key={`existing-${data.step}-${index}`}
                      data={data}
                      isLast={index === 7}
                      variant="existing"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case '職業別':
        return (
          <div className="grid grid-cols-1 gap-12">
            <div className="relative bg-gray-50/80 rounded-lg p-6 pt-8">
              <h3 className="absolute -top-3 left-4 text-sm font-semibold text-gray-700 bg-white px-2 py-1 rounded border border-gray-200">
                会社員
              </h3>
              <div className="overflow-x-auto">
                <div className="flex flex-nowrap items-center gap-1 min-w-max pb-4">
                  {section.data.slice(0, 7).map((data: FunnelData, index: number) => (
                    <FunnelStep
                      key={`company-${data.step}-${index}`}
                      data={data}
                      isLast={index === 6}
                      variant="company"
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="relative bg-gray-50/80 rounded-lg p-6 pt-8">
              <h3 className="absolute -top-3 left-4 text-sm font-semibold text-gray-700 bg-white px-2 py-1 rounded border border-gray-200">
                フリーランス
              </h3>
              <div className="overflow-x-auto">
                <div className="flex flex-nowrap items-center gap-1 min-w-max pb-4">
                  {section.data.slice(7).map((data: FunnelData, index: number) => (
                    <FunnelStep
                      key={`freelance-${data.step}-${index}`}
                      data={data}
                      isLast={index === 6}
                      variant="freelance"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case '経験年数別':
      case '年収別':
        const labels = section.title === '経験年数別'
          ? ['未経験', '1年未満', '1-2年', '2-3年', '3-4年', '4年以上']
          : ['～20万円', '20-40万円', '40-60万円', '60-80万円', '80-100万円', '100万円～'];

        const variant = section.title === '経験年数別' ? 'experience' : 'salary';

        return (
          <div className="grid grid-cols-1 gap-8">
            {labels.map((label, groupIndex) => {
              const startIndex = groupIndex * 7;
              return (
                <div key={label} className="relative bg-gray-50/80 rounded-lg p-6 pt-8 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="absolute -top-3 left-4 text-sm font-semibold text-gray-700 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                    {label}
                  </h3>
                  <div className="overflow-x-auto">
                    <div className="flex flex-nowrap items-center gap-1 min-w-max">
                      {section.data.slice(startIndex, startIndex + 7).map((data: FunnelData, index: number) => (
                        <FunnelStep
                          key={`${variant}-${groupIndex}-${data.step}-${index}`}
                          data={data}
                          isLast={index === 6}
                          variant={variant}
                          index={groupIndex}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-12">
      <h1 className="text-4xl font-bold mb-16 text-center">Funnel Viewer</h1>
      <div className="space-y-36">
        {funnelSections.map((section) => (
          <div key={section.title} className="w-full relative">
            <div className="border-b border-gray-200 mb-12">
              <h2 className="text-2xl font-bold mb-4 text-gray-700 inline-block border-b-2 border-gray-700 pb-2">
                {section.title}
              </h2>
            </div>
            <div className="relative w-full space-y-8">
              <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-transparent rounded-lg -z-10" />
              {renderSection(section)}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
