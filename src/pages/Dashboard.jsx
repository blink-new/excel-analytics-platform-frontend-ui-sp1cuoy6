import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Dashboard = ({ user }) => {
  const [files, setFiles] = useState([])
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalCharts: 0,
    storageUsed: 0
  })

  useEffect(() => {
    // Mock data for uploaded files
    const mockFiles = [
      {
        id: 1,
        name: 'Sales_Data_Q1.xlsx',
        uploadDate: '2024-01-15',
        size: '2.3 MB',
        charts: 3,
        preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzMzNzNkYyIvPjx0ZXh0IHg9IjEwMCIgeT0iNTUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkJhciBDaGFydDwvdGV4dD48L3N2Zz4='
      },
      {
        id: 2,
        name: 'Marketing_Metrics.xlsx',
        uploadDate: '2024-01-10',
        size: '1.8 MB',
        charts: 2,
        preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMDAiIGN5PSI1MCIgcj0iNDAiIGZpbGw9IiMxMGI5ODEiLz48dGV4dCB4PSIxMDAiIHk9IjU1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5QaWUgQ2hhcnQ8L3RleHQ+PC9zdmc+'
      },
      {
        id: 3,
        name: 'Financial_Report.xlsx',
        uploadDate: '2024-01-05',
        size: '3.1 MB',
        charts: 5,
        preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjAgODBMMTAwIDIwTDE4MCA2MCIgc3Ryb2tlPSIjZWY0NDQ0IiBzdHJva2Utd2lkdGg9IjMiIGZpbGw9Im5vbmUiLz48dGV4dCB4PSIxMDAiIHk9IjkwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiNlZjQ0NDQiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkxpbmUgQ2hhcnQ8L3RleHQ+PC9zdmc+'
      }
    ]

    setFiles(mockFiles)
    setStats({
      totalFiles: mockFiles.length,
      totalCharts: mockFiles.reduce((sum, file) => sum + file.charts, 0),
      storageUsed: 7.2
    })
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Welcome back, {user?.name}!
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Here's what's happening with your Excel analytics today.
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            to="/upload"
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            📁 Upload New File
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Files</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalFiles}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">📈</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Charts</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalCharts}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">💾</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Storage Used</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.storageUsed} MB</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Files List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Files</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Your uploaded Excel files and generated charts.
          </p>
        </div>
        <ul className="divide-y divide-gray-200">
          {files.map((file) => (
            <li key={file.id}>
              <div className="px-4 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-16 w-20">
                    <img
                      className="h-16 w-20 rounded-md object-cover"
                      src={file.preview}
                      alt="Chart preview"
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{file.name}</div>
                    <div className="text-sm text-gray-500">
                      Uploaded on {file.uploadDate} • {file.size} • {file.charts} charts
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/charts/${file.id}`}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    View Charts
                  </Link>
                  <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Download
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {files.length === 0 && (
          <div className="text-center py-12">
            <span className="text-4xl">📁</span>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No files uploaded</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by uploading your first Excel file.</p>
            <div className="mt-6">
              <Link
                to="/upload"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                📁 Upload File
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard