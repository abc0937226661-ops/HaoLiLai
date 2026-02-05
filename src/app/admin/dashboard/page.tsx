import { getTotalVisits, getVisitsByHour, getVisitsByDay, getPeakTraffic, getVisitsByPage } from "@/actions/analytics-actions";
import BarChart from "@/components/admin/BarChart";
import { Activity, TrendingUp, Clock, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const totalVisits = await getTotalVisits();
    const hourlyData = await getVisitsByHour();
    const dailyData = await getVisitsByDay(7); // Last 7 days
    const peakData = await getPeakTraffic();
    const pageViews = await getVisitsByPage();

    // Format hourly data for chart
    const hourlyChartData = hourlyData.map(h => ({
        label: `${h.hour}:00`,
        value: h.count,
    }));

    // Format daily data for chart
    const dailyChartData = dailyData.map(d => ({
        label: new Date(d.date).toLocaleDateString('zh-TW', { month: '2-digit', day: '2-digit' }),
        value: d.count,
    }));

    // Format page views for chart
    const pageChartData = pageViews
        .filter(p => p.path !== null)
        .map(p => ({
            label: p.path === '/' ? '首頁' : (p.path?.substring(0, 20) || ''),
            value: p.count,
        }));

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center gap-3">
                <Activity className="h-8 w-8 text-amber-400" />
                <h1 className="text-3xl font-bold text-white">流量分析儀表板</h1>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-blue-200 text-sm">總瀏覽人次</span>
                        <Activity className="h-5 w-5 text-blue-200" />
                    </div>
                    <div className="text-3xl font-bold">{totalVisits.toLocaleString()}</div>
                    <div className="text-blue-200 text-xs mt-1">有效互動訪客</div>
                </div>

                <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-amber-200 text-sm">今日高峰時段</span>
                        <Clock className="h-5 w-5 text-amber-200" />
                    </div>
                    <div className="text-3xl font-bold">{peakData.peakHourToday.hour}:00</div>
                    <div className="text-amber-200 text-xs mt-1">{peakData.peakHourToday.count} 次瀏覽</div>
                </div>

                <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-green-200 text-sm">本月高峰日</span>
                        <Calendar className="h-5 w-5 text-green-200" />
                    </div>
                    <div className="text-lg font-bold">
                        {peakData.peakDayThisMonth.date ?
                            new Date(peakData.peakDayThisMonth.date).toLocaleDateString('zh-TW') :
                            '無資料'}
                    </div>
                    <div className="text-green-200 text-xs mt-1">{peakData.peakDayThisMonth.count} 次瀏覽</div>
                </div>

                <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-purple-200 text-sm">歷史最高峰</span>
                        <TrendingUp className="h-5 w-5 text-purple-200" />
                    </div>
                    <div className="text-lg font-bold">
                        {peakData.allTimePeak.date ?
                            new Date(peakData.allTimePeak.date).toLocaleDateString('zh-TW') :
                            '無資料'}
                    </div>
                    <div className="text-purple-200 text-xs mt-1">{peakData.allTimePeak.count} 次瀏覽</div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BarChart
                    data={hourlyChartData}
                    title="今日每小時瀏覽量"
                    color="bg-blue-500"
                />
                <BarChart
                    data={dailyChartData}
                    title="近 7 日瀏覽量"
                    color="bg-green-500"
                />
            </div>

            <div className="grid grid-cols-1">
                <BarChart
                    data={pageChartData}
                    title="熱門頁面 TOP 10"
                    color="bg-amber-500"
                />
            </div>
        </div>
    );
}
