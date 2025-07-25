import React, { useState, useCallback } from 'react'
import * as XLSX from 'xlsx'

const Upload = ({ user }) => {
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState(null)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = async (selectedFile) => {
    setError('')
    setLoading(true)

    // Validate file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ]
    
    if (!validTypes.includes(selectedFile.type)) {
      setError('Please upload a valid Excel file (.xlsx or .xls)')
      setLoading(false)
      return
    }

    // Validate file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB')
      setLoading(false)
      return
    }

    try {
      setFile(selectedFile)
      
      // Read and parse Excel file
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result)
          const workbook = XLSX.read(data, { type: 'array' })
          
          // Get first worksheet
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          
          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
          
          setData({
            sheetName,
            headers: jsonData[0] || [],
            rows: jsonData.slice(1, 11), // Show first 10 rows
            totalRows: jsonData.length - 1
          })
          setLoading(false)
        } catch (err) {
          setError('Error parsing Excel file: ' + err.message)
          setLoading(false)
        }
      }
      
      reader.readAsArrayBuffer(selectedFile)
    } catch (err) {
      setError('Error reading file: ' + err.message)
      setLoading(false)
    }
  }

  const handleUpload = async () => {
    if (!file || !data) return

    setLoading(true)
    try {
      // Mock upload process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real app, you would upload to your backend here
      console.log('File uploaded:', file.name)
      
      // Reset form
      setFile(null)
      setData(null)
      setError('')
      alert('File uploaded successfully!')
    } catch (err) {
      setError('Upload failed: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
          Upload Excel File
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Upload your Excel file to start creating charts and analytics.
        </p>
      </div>

      {/* Upload Area */}
      <div className="bg-white shadow rounded-lg p-6">
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 ${
            dragActive
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <span className="text-4xl">📁</span>
            <div className="mt-4">
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  {dragActive ? 'Drop your Excel file here' : 'Drag and drop your Excel file here, or click to browse'}
                </span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  accept=".xlsx,.xls"
                  onChange={handleChange}
                />
              </label>
              <p className="mt-1 text-xs text-gray-500">
                Supports .xlsx and .xls files up to 10MB
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {loading && (
          <div className="mt-4 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-sm text-gray-600">Processing file...</span>
          </div>
        )}
      </div>

      {/* File Preview */}
      {data && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900">File Preview</h3>
              <p className="text-sm text-gray-500">
                {file?.name} • Sheet: {data.sheetName} • {data.totalRows} rows
              </p>
            </div>
            <button
              onClick={handleUpload}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Uploading...' : 'Upload File'}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {data.headers.map((header, index) => (
                    <th
                      key={index}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header || `Column ${index + 1}`}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {data.headers.map((_, colIndex) => (
                      <td
                        key={colIndex}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {row[colIndex] || ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data.totalRows > 10 && (
            <div className="mt-4 text-center text-sm text-gray-500">
              Showing first 10 rows of {data.totalRows} total rows
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Upload