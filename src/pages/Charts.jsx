import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar, Line, Pie, Scatter } from 'react-chartjs-2'
import * as THREE from 'three'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const Charts = ({ user }) => {
  const { fileId } = useParams()
  const [selectedFile, setSelectedFile] = useState(null)
  const [chartType, setChartType] = useState('bar')
  const [xAxis, setXAxis] = useState('')
  const [yAxis, setYAxis] = useState('')
  const [chartData, setChartData] = useState(null)
  const [aiInsights, setAiInsights] = useState('')
  const threeRef = useRef(null)
  const sceneRef = useRef(null)

  // Mock data
  const mockData = {
    headers: ['Month', 'Sales', 'Revenue', 'Customers', 'Growth'],
    rows: [
      ['Jan', 1200, 45000, 150, 5.2],
      ['Feb', 1350, 52000, 180, 6.1],
      ['Mar', 1100, 41000, 140, 4.8],
      ['Apr', 1600, 62000, 220, 8.3],
      ['May', 1800, 71000, 250, 9.1],
      ['Jun', 2000, 85000, 290, 11.2]
    ]
  }

  useEffect(() => {
    setSelectedFile(mockData)
    setXAxis('Month')
    setYAxis('Sales')
    generateAIInsights()
  }, [fileId])

  useEffect(() => {
    if (selectedFile && xAxis && yAxis) {
      generateChartData()
    }
  }, [selectedFile, xAxis, yAxis, chartType])

  const generateChartData = () => {
    if (!selectedFile) return

    const xIndex = selectedFile.headers.indexOf(xAxis)
    const yIndex = selectedFile.headers.indexOf(yAxis)

    if (xIndex === -1 || yIndex === -1) return

    const labels = selectedFile.rows.map(row => row[xIndex])
    const data = selectedFile.rows.map(row => row[yIndex])

    const colors = [
      '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'
    ]

    let chartConfig = {}

    switch (chartType) {
      case 'bar':
        chartConfig = {
          labels,
          datasets: [{
            label: yAxis,
            data,
            backgroundColor: colors[0],
            borderColor: colors[0],
            borderWidth: 1
          }]
        }
        break
      case 'line':
        chartConfig = {
          labels,
          datasets: [{
            label: yAxis,
            data,
            borderColor: colors[1],
            backgroundColor: colors[1] + '20',
            tension: 0.1
          }]
        }
        break
      case 'pie':
        chartConfig = {
          labels,
          datasets: [{
            data,
            backgroundColor: colors.slice(0, data.length),
            borderWidth: 2
          }]
        }
        break
      case 'scatter':
        chartConfig = {
          datasets: [{
            label: `${xAxis} vs ${yAxis}`,
            data: selectedFile.rows.map(row => ({
              x: row[xIndex],
              y: row[yIndex]
            })),
            backgroundColor: colors[3]
          }]
        }
        break
    }

    setChartData(chartConfig)

    // Generate 3D chart if selected
    if (chartType === '3d') {
      generate3DChart(labels, data)
    }
  }

  const generate3DChart = (labels, data) => {
    if (!threeRef.current) return

    // Clear previous scene
    if (sceneRef.current) {
      threeRef.current.removeChild(sceneRef.current.domElement)
    }

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, 400 / 300, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(400, 300)
    renderer.setClearColor(0xf8f9fa)
    threeRef.current.appendChild(renderer.domElement)

    // Create 3D bars
    const maxValue = Math.max(...data)
    data.forEach((value, index) => {
      const height = (value / maxValue) * 5
      const geometry = new THREE.BoxGeometry(0.8, height, 0.8)
      const material = new THREE.MeshBasicMaterial({ color: 0x3b82f6 })
      const cube = new THREE.Mesh(geometry, material)
      cube.position.x = (index - data.length / 2) * 1.5
      cube.position.y = height / 2
      scene.add(cube)
    })

    camera.position.z = 8
    camera.position.y = 3
    camera.lookAt(0, 0, 0)

    const animate = () => {
      requestAnimationFrame(animate)
      scene.rotation.y += 0.01
      renderer.render(scene, camera)
    }
    animate()

    sceneRef.current = renderer
  }

  const generateAIInsights = () => {
    const insights = [
      "📈 Sales trend shows strong growth in Q2 with 45% increase from Q1",
      "🎯 Peak performance observed in June with 2000 units sold",
      "📊 Revenue correlation with customer acquisition is 0.89 (very strong)",
      "⚡ Growth rate accelerated significantly after April marketing campaign",
      "💡 Recommendation: Focus marketing efforts on Q2 patterns for Q3"
    ]
    
    setAiInsights(insights[Math.floor(Math.random() * insights.length)])
  }

  const downloadChart = (format) => {
    if (chartType === '3d') {
      // For 3D charts, capture the canvas
      const canvas = threeRef.current?.querySelector('canvas')
      if (canvas) {
        const link = document.createElement('a')
        link.download = `3d-chart.${format}`
        link.href = canvas.toDataURL()
        link.click()
      }
      return
    }

    // For 2D charts
    const canvas = document.querySelector('canvas')
    if (canvas) {
      const link = document.createElement('a')
      link.download = `chart.${format}`
      link.href = canvas.toDataURL()
      link.click()
    }
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${yAxis} by ${xAxis}`,
      },
    },
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
          Chart Generator
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Create interactive charts from your Excel data.
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Chart Type</label>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="bar">Bar Chart</option>
              <option value="line">Line Chart</option>
              <option value="pie">Pie Chart</option>
              <option value="scatter">Scatter Plot</option>
              <option value="3d">3D Column</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">X-Axis</label>
            <select
              value={xAxis}
              onChange={(e) => setXAxis(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              {selectedFile?.headers.map((header, index) => (
                <option key={index} value={header}>{header}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Y-Axis</label>
            <select
              value={yAxis}
              onChange={(e) => setYAxis(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              {selectedFile?.headers.map((header, index) => (
                <option key={index} value={header}>{header}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => generateChartData()}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Generate Chart
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Display */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Chart Visualization</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => downloadChart('png')}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  📥 PNG
                </button>
                <button
                  onClick={() => downloadChart('pdf')}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  📄 PDF
                </button>
              </div>
            </div>

            <div className="h-96 flex items-center justify-center">
              {chartType === '3d' ? (
                <div ref={threeRef} className="w-full h-full flex items-center justify-center" />
              ) : chartData ? (
                <div className="w-full h-full">
                  {chartType === 'bar' && <Bar data={chartData} options={chartOptions} />}
                  {chartType === 'line' && <Line data={chartData} options={chartOptions} />}
                  {chartType === 'pie' && <Pie data={chartData} options={chartOptions} />}
                  {chartType === 'scatter' && <Scatter data={chartData} options={chartOptions} />}
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <span className="text-4xl">📊</span>
                  <p className="mt-2">Select data and chart type to generate visualization</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">🤖 AI Insights</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">{aiInsights}</p>
            </div>
            <button
              onClick={generateAIInsights}
              className="mt-4 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Generate New Insight
            </button>
          </div>

          {/* Data Summary */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">📈 Data Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Total Records:</span>
                <span className="text-sm font-medium text-gray-900">{selectedFile?.rows.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Columns:</span>
                <span className="text-sm font-medium text-gray-900">{selectedFile?.headers.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Chart Type:</span>
                <span className="text-sm font-medium text-gray-900 capitalize">{chartType}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Charts