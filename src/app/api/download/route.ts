import { NextRequest, NextResponse } from 'next/server';
import ytDlp from 'yt-dlp-exec';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Call yt-dlp to get video information
    const videoInfo: any = await ytDlp(url, {
      dumpJson: true,
      noWarnings: true,
      preferFreeFormats: true,
    });

    if (!videoInfo || typeof videoInfo !== 'object') {
       return NextResponse.json({ error: 'Failed to fetch video info' }, { status: 500 });
    }

    // Extract formats and send back the best video/audio links
    const formats = videoInfo.formats || [];
    
    // Find a good mp4 format with both video and audio
    let bestFormat = formats.find((f: any) => f.ext === 'mp4' && f.acodec !== 'none' && f.vcodec !== 'none');
    
    if (!bestFormat) {
       bestFormat = formats.filter((f: any) => f.url).pop();
    }

    if (!bestFormat || !bestFormat.url) {
       return NextResponse.json({ error: 'No suitable format found' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      title: videoInfo.title,
      thumbnail: videoInfo.thumbnail,
      downloadUrl: bestFormat.url,
      extractor: videoInfo.extractor,
    });

  } catch (error: any) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Failed to process URL', details: error.message }, { status: 500 });
  }
}
