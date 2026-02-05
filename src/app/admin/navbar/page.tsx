import { getAdminNavbarItems } from "@/actions/navbar-actions";
import NavbarAdminPage from "@/components/admin/NavbarAdminPage";

export const dynamic = "force-dynamic";

export default async function Page() {
    const items = await getAdminNavbarItems();
    return <NavbarAdminPage initialItems={items} />;
}
