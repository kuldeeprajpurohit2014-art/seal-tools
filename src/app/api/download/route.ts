import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Bypass faulty library completely and run the binary directly
    const { stdout } = await execAsync(`/usr/local/bin/yt-dlp --dump-json --no-warnings --prefer-free-formats "${url}"`, {
      maxBuffer: 10 * 1024 * 1024
    });
    
    const videoInfo = JSON.parse(stdout);

    const bestFormat = videoInfo.formats
      ?.filter((f: any) => f.url && f.vcodec !== 'none' && f.acodec !== 'none')
      .sort((a: any, b: any) => (b.height || 0) - (a.height || 0))[0];

    const fallbackFormat = videoInfo.formats
      ?.filter((f: any) => f.url)
      .sort((a: any, b: any) => (b.height || 0) - (a.height || 0))[0];

    const finalFormat = bestFormat || fallbackFormat;

    if (!finalFormat || !finalFormat.url) {
      return NextResponse.json({ error: 'No suitable format found' }, { status: 500 });
    }

    return NextResponse.json({
      title: videoInfo.title,
      thumbnail: videoInfo.thumbnail,
      downloadUrl: finalFormat.url,
      format: finalFormat.ext || 'mp4',
    });

  } catch (error: any) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Failed to process URL', details: error.message }, { status: 500 });
  }
}
