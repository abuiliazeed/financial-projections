import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-4">
          Small Business Financial Projections
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Manage and forecast your business finances with ease
        </p>
        
        <div className="space-y-4">
          <Link href="/login" className="block">
            <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors">
              Login
            </button>
          </Link>
          
          <Link href="/signup" className="block">
            <button className="w-full border border-blue-500 text-blue-500 py-2 rounded-md hover:bg-blue-50 transition-colors">
              Create an Account
            </button>
          </Link>
        </div>
        
        <div className="text-center text-xs text-gray-500 mt-6">
          <p>Simplify your financial planning</p>
          <p>Gain insights into your business&apos;s financial health</p>
        </div>
      </div>
    </div>
  )
}
