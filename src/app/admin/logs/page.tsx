import { getRecentLogs } from "@/actions/cms-actions";
import { ScrollText, MapPin, Monitor } from "lucide-react";

export default async function LogsPage() {
    const logs = await getRecentLogs();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                        <ScrollText className="text-amber-500" />
                        流量瀏覽紀錄
                    </h1>
                    <p className="text-slate-400">顯示最近 50 筆訪客紀錄</p>
                </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
                <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-slate-950 text-slate-200 uppercase">
                        <tr>
                            <th className="px-6 py-4 font-bold">路徑 (Path)</th>
                            <th className="px-6 py-4 font-bold">IP 位址</th>
                            <th className="px-6 py-4 font-bold">裝置 (User Agent)</th>
                            <th className="px-6 py-4 font-bold">時間</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-4 font-mono text-amber-400">
                                    {log.path}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="flex items-center gap-2">
                                        <MapPin className="w-3 h-3" />
                                        {log.ip}
                                        {log.country && <span className="text-xs bg-slate-800 px-1 rounded">{log.country}</span>}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 max-w-xs truncate" title={log.userAgent || ''}>
                                        <Monitor className="w-3 h-3 shrink-0" />
                                        {log.userAgent?.substring(0, 30)}...
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-500">
                                    {log.createdAt ? new Date(log.createdAt).toLocaleString('zh-TW') : '-'}
                                </td>
                            </tr>
                        ))}
                        {logs.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                    尚無瀏覽紀錄
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
