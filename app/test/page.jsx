
'use client'

import { useEffect, useState } from 'react'

export default function TestPage() {
  const [output, setOutput] = useState('⏳ Waiting for response...')

  useEffect(() => {
    async function addContent() {
      const res = await fetch('/api/content/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: 'shows',
          list: 'inProgress',
          item: {
            id: 'test-show-004',
            title: 'stranger things',
            year: 2023,
            image: 'https://imgs.search.brave.com/v6ubDJBc2WYZNxfpqSgK9JXI94an-Isow6bG7NBT1do/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9rbm93/bGVkZ2UuaHVic3Bv/dC5jb20vaHViZnMv/aG93LXRvLW1ha2Ut/cGljdHVyZS1pbnRv/LWxpbmstNS0yMDI0/MTAyMy04MDk5MzEw/LndlYnA',
            description: 'a test show',
            
            tag: 'test'
          }
        })
      })

      const data = await res.json()
      console.log('API response:', data)
      setOutput("📦 Response: " + JSON.stringify(data, null, 2))
    }

    addContent()
  }, [])

  return (
    <div className="text-2xl text-center text-white m-20 whitespace-pre-wrap">
      {output}
    </div>
  )
}
