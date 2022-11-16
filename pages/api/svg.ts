import type { NextRequest } from 'next/server'

import QueryType from '../../common/types/queryType'
import renderCardSVG from '../../common/renderSVG'

const svgEndpoint = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url)
  const query = Object.fromEntries(searchParams) as QueryType

  try {
    const svg = await renderCardSVG(query)

    return new Response(svg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': `public, immutable, no-transform, max-age=0, s-maxage=${
          searchParams.has('cache') ? searchParams.get('cache') : 3600
        }`
      }
    })
  } catch (ex) {
    console.error(ex)

    return new Response(JSON.stringify({ error: ex }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'maxage=0, public'
      }
    })
  }
}

export const config = {
  runtime: 'experimental-edge'
}

export default svgEndpoint
