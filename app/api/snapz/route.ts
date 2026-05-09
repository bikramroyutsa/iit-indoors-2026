import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const snapzDir = path.join(process.cwd(), 'public', 'snapz');
    
    // Check if directory exists
    if (!fs.existsSync(snapzDir)) {
      return NextResponse.json([]);
    }

    const files = fs.readdirSync(snapzDir);
    
    // Filter for common image extensions
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const photos = files
      .filter(file => imageExtensions.includes(path.extname(file).toLowerCase()))
      .map((file, index) => {
        const fileNameWithoutExt = path.parse(file).name;
        // Clean up common characters for caption
        const caption = fileNameWithoutExt.replace(/[_-]/g, ' ').toLowerCase();
        
        return {
          id: `snap-${index}`,
          url: `/snapz/${file}`,
          caption: caption
        };
      });

    return NextResponse.json(photos);
  } catch (error) {
    console.error('Failed to read snapz directory:', error);
    return NextResponse.json({ error: 'Failed to load snaps' }, { status: 500 });
  }
}
