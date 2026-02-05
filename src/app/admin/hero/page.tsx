import { getAdminHeroSlides } from "@/actions/hero-actions";
import HeroAdminPage from "@/components/admin/HeroAdminPage";

export const dynamic = "force-dynamic";

export default async function Page() {
    const slides = await getAdminHeroSlides();
    return <HeroAdminPage initialSlides={slides} />;
}
