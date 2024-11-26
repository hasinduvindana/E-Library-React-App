import { Outlet } from "react-router-dom"

const AuthLayout = () => {
  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-screen">
    <div className="relative hidden lg:block bg-gradient-to-t from-[#180d3b]/90 to-[#180d3b]/70">
      <img
        width={2000}
        height={2000}
        src="https://img.freepik.com/premium-photo/seamless-pattern-with-handdrawn-book-coffee-stars_123891-43218.jpg?w=1800"
        alt="Auth background"
        className="object-cover flex justify-center items-center w-[550px] h-[550px] relative left-28 top-28 shadow-2xl shadow-black-100 rounded-lg transition-transform duration-500 ease-in-out transform hover:scale-105 custom-bounce"
      />
      {/* Optional overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
    </div>
    <div className="flex items-center justify-center py-12">
        <Outlet />
    </div>
  </div>
  )
}
export default AuthLayout