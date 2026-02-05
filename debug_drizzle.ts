
import { db } from './src/db/db';
import { heroSlides } from './src/db/schema';
import { eq } from 'drizzle-orm';

async function main() {
    console.log("Reading via Drizzle...");
    const slides = await db.query.heroSlides.findMany();
    console.log("Drizzle Result Sample:", JSON.stringify(slides[0], null, 2));

    // Check specific keys
    if (slides.length > 0) {
        const s = slides[0];
        console.log("Has imageOffsetX?", 'imageOffsetX' in s);
        console.log("Has image_offset_x?", 'image_offset_x' in s);
        console.log("Value of imageOffsetX:", s.imageOffsetX);
    }
}

main().catch(console.error);
