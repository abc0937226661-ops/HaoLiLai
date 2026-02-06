export const dynamic = 'force-dynamic';
import { getAdminGames } from "@/actions/game-actions";
import GameAdminPage from "@/components/admin/GameAdminPage";

export default async function Page() {
    const games = await getAdminGames();
    return <GameAdminPage initialGames={games} />;
}
