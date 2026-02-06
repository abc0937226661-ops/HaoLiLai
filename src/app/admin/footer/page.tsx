export const dynamic = 'force-dynamic';
import { getAdminFooterSections, getAdminFooterLinks, getAdminFooterConfig } from "@/actions/footer-actions";
import FooterAdminPage from "@/components/admin/FooterAdminPage";

export const dynamic = "force-dynamic";

export default async function Page() {
    const sections = await getAdminFooterSections();
    const links = await getAdminFooterLinks();
    const config = await getAdminFooterConfig();

    return <FooterAdminPage initialSections={sections} initialLinks={links} initialConfig={config} />;
}
