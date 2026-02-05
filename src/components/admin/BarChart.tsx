"use client";

interface ChartData {
    label: string;
    value: number;
}

interface BarChartProps {
    data: ChartData[];
    title: string;
    color?: string;
}

export default function BarChart({ data, title, color = "bg-amber-500" }: BarChartProps) {
    const maxValue = Math.max(...data.map(d => d.value), 1);

    // Filter out zero values for cleaner display
    const displayData = data.filter(d => d.value > 0);

    if (displayData.length === 0) {
        return (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-white font-bold text-lg mb-6">{title}</h3>
                <div className="text-slate-500 text-center py-8">
                    暫無數據
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-white font-bold text-lg mb-6">{title}</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
                {displayData.map((item, index) => {
                    const percentage = (item.value / maxValue) * 100;
                    const width = Math.max(percentage, 5); // Minimum 5% width for visibility

                    return (
                        <div key={index} className="flex items-center gap-3">
                            <span className="text-slate-400 text-sm w-20 text-right flex-shrink-0">
                                {item.label}
                            </span>
                            <div className="flex-1 bg-slate-800 rounded-full h-10 relative overflow-hidden">
                                <div
                                    className={`${color} h-full rounded-full transition-all duration-500 flex items-center justify-end pr-3 min-w-[40px]`}
                                    style={{ width: `${width}%` }}
                                >
                                    <span className="text-white font-bold text-sm drop-shadow-lg">
                                        {item.value}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
