import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="flex w-full min-h-screen bg-gray-100 relative">
      <div className="relative w-1/2 lg:flex overflow-hidden">
        <img
          src="/AuthLayout.webp"
          alt="Welcome To StyleHub Website"
          className="absolute inset-0 w-full h-full object-fill blur-lg"
          style={{ filter: "brightness(0.2)" }}
        />

        <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-10 shadow-lg">
          <img
            src="/AuthLayout.webp"
            alt="AuthLayout Image"
            className="w-[34rem] h-auto rounded-lg object-fill"
          />
        </div>
      </div>

      <div className="flex items-center justify-center flex-1 px-4 py-12 bg-white shadow-lg sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
