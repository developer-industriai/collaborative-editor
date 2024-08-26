'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface Comment {
  id: string
  content: string
  // Add other properties as needed
}

interface TestRecord {
  id: string
  name: string
  value: number
  // Add other properties as needed
}

export default function Dashboard() {
  const [comments, setComments] = useState<Comment[]>([])
  const [testRecords, setTestRecords] = useState<TestRecord[]>([])

  useEffect(() => {
    console.log('Dashboard: Setting up SSE connection');
    // Fetch comments
    fetch('/api/comments')
      .then(response => response.json())
      .then(data => setComments(data))
      .catch(error => console.error('Error fetching comments:', error))

    // Set up SSE for real-time test updates
    const eventSource = new EventSource('/api/listTests?sse=true')

    eventSource.onmessage = (event) => {
      console.log('Dashboard: Received SSE update', event.data);
      const data = JSON.parse(event.data)
      setTestRecords(data)
    }

    eventSource.onerror = (error) => {
      console.error('SSE error:', error)
      eventSource.close()
    }

    return () => {
      console.log('Dashboard: Closing SSE connection');
      eventSource.close()
    }
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Content</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {comments.map(comment => (
            <TableRow key={comment.id}>
              <TableCell>{comment.id}</TableCell>
              <TableCell>{comment.content}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <h2 className="text-2xl font-bold my-4 text-white">Test Records (Real-time)</h2>
      <Table className="text-white">
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {testRecords.map(record => (
            <TableRow key={record.id}>
              <TableCell>{record.id}</TableCell>
              <TableCell>{record.name}</TableCell>
              <TableCell>{record.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}