export const dynamic = 'force-dynamic';
import { getAdminNews } from "@/actions/news-actions";
import NewsAdminPage from "@/components/admin/NewsAdminPage";

export default async function Page() {
    const news = await getAdminNews();
    return <NewsAdminPage initialNews={news} />;
}
