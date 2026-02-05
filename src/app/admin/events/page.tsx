import { getAdminEvents } from "@/actions/event-actions";
import EventsAdminPage from "@/components/admin/EventsAdminPage";

export const dynamic = "force-dynamic";

export default async function Page() {
    const events = await getAdminEvents();
    return <EventsAdminPage initialEvents={events} />;
}
