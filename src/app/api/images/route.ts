import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return NextResponse.json(
      { error: 'Image URL is required' },
      { status: 400 }
    );
  }

  try {
    // Validate that the URL is from a Reddit domain
    const url = new URL(imageUrl);
    const allowedDomains = ['preview.redd.it', 'i.redd.it', 'v.redd.it', 'external-preview.redd.it'];

    if (!allowedDomains.some(domain => url.hostname.includes(domain))) {
      return NextResponse.json(
        { error: 'Only Reddit image/video URLs are allowed' },
        { status: 400 }
      );
    }

    console.log('Original URL:', imageUrl);
    const decodedUrl = decodeURIComponent(imageUrl);
    console.log('Decoded URL:', decodedUrl);

    // Fetch the image from Reddit's CDN with proper headers
    const response = await fetch(decodedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://www.reddit.com/',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    if (!response.ok) {
      console.error('Image fetch error:', response.status, response.statusText);
      return NextResponse.json(
        { error: `Failed to fetch image: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    // Get the image data
    const imageBuffer = await response.arrayBuffer();

    // Get content type from response headers, determine if it's video or image
    const contentType = response.headers.get('content-type') || '';
    const isVideo = contentType.includes('video/');
    const finalContentType = isVideo ? contentType : (contentType.includes('image/') ? contentType : 'image/jpeg');

    // Return the media data with proper CORS headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': finalContentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Media proxy error:', error);
    return NextResponse.json(
      { error: `Proxy error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}