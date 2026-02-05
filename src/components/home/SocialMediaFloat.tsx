import { getActiveSocialLinks } from "@/actions/social-actions";
import SocialButtons from "./SocialButtons";

export default async function SocialMediaFloat() {
    const socialLinks = await getActiveSocialLinks();

    if (socialLinks.length === 0) return null;

    return <SocialButtons links={socialLinks} />;
}
