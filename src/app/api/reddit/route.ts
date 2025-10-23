import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const redditUrl = searchParams.get('url');

  if (!redditUrl) {
    return NextResponse.json(
      { error: 'Reddit URL is required' },
      { status: 400 }
    );
  }

  try {
    // Validate that the URL is a Reddit URL
    const url = new URL(redditUrl);
    if (!url.hostname.match(/^(?:www\.)?reddit\.com$/)) {
      return NextResponse.json(
        { error: 'Only Reddit URLs are allowed' },
        { status: 400 }
      );
    }

    // Construct the Reddit API URL
    const apiPath = url.pathname + '.json';
    const apiUrl = `https://www.reddit.com${apiPath}`;

    // Fetch from Reddit API
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'RedditShot/1.0 (https://watzon.tech; contact@watzon.tech)'
      }
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Reddit API error: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Return the data with proper CORS headers
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
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