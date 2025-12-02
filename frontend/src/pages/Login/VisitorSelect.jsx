import { Link } from "react-router-dom";

export default function VisitorSelect() {
  const gold = "#D9B64A";
  const goldHover = "#B9983C";
  const dark = "#231F20";

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans" style={{ backgroundColor: "#F9F9F9" }}>
      
      {/* Page transition animation styles */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(0.95);
          }
        }

        .page-transition-enter {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .page-transition-exit {
          animation: fadeOut 0.4s ease-out forwards;
        }

        /* Button hover animations */
        .animate-button {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .animate-button:hover {
          transform: translateY(-2px);
        }

        .animate-button:active {
          transform: translateY(0);
        }
      `}</style>

      {/* --- BACKGROUND LAYER 1: Gold Dot Grid --- */}
      <div 
        className="absolute inset-0 z-0"
        style={{ 
          backgroundImage: `radial-gradient(${gold}40 1px, transparent 1px)`, 
          backgroundSize: "30px 30px" 
        }}
      ></div>

      {/* --- BACKGROUND LAYER 2: Giant GIA Logo Watermark --- */}
      <img
        src="/gia-logo2.PNG" 
        alt="GIA Watermark"
        className="absolute z-0 pointer-events-none"
        style={{
          width: "2500px", 
          opacity: 0.08, 
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)", 
          filter: "grayscale(100%)" 
        }}
      />

      {/* --- FOREGROUND: The Login Card --- */}
      <div 
        className="relative z-10 rounded-3xl shadow-2xl overflow-hidden w-[900px] h-[550px] flex page-transition-enter"
      >

        {/* LEFT SIDE */}
        <div
          className="w-1/2 flex flex-col justify-center items-center p-10 relative bg-white"
          style={{ backgroundColor: dark, color: "white" }}
        >
          {/* --- LOGO CIRCLE --- */}
          <div className="w-24 h-24 rounded-full flex items-center justify-center mb-5 overflow-hidden bg-white p-3 shadow-lg transform transition-transform hover:scale-105 duration-500">
            <img 
              src="/gia-logo.PNG" 
              alt="Logo" 
              className="w-full h-full object-contain" 
            />
          </div>

          <h2 className="text-3xl font-semibold mb-2">Feedback System</h2>
          <p className="text-sm text-[#D9B64A]">Evolve GIA powered by Nucleus</p>
          <div className="absolute bottom-5 text-xs opacity-40">
            @TeamDigitalizationGIA | v3.0.2
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-1/2 flex flex-col justify-center px-16 relative bg-white/95 backdrop-blur-sm">
          
          <div className="absolute top-0 right-0 w-24 h-2" style={{ backgroundColor: gold }}></div>

          <h1 className="text-4xl font-bold mb-1" style={{ color: dark }}>
            Feedback <span style={{ color: gold }}>GIA</span>
          </h1>

          <p className="text-gray-500 mb-10">Please select your visitor type</p>

          {/* INTERNAL VISITOR BUTTON */}
          <Link
            to="/login/internal"
            className="animate-button group w-full text-white py-4 px-6 rounded-xl text-center font-semibold mb-4 flex items-center justify-center gap-3 shadow-md hover:shadow-xl"
            style={{ backgroundColor: gold }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = goldHover)}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = gold)}
          >
            {/* ID Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
            </svg>
            Internal Visitor
          </Link>

          {/* GUEST VISITOR BUTTON */}
          <Link
            to="/login/guest"
            className="animate-button group w-full border-2 py-4 px-6 rounded-xl text-center font-semibold mb-4 flex items-center justify-center gap-3 hover:shadow-lg"
            style={{ borderColor: "#E5E5E5", color: dark }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = gold;
              e.currentTarget.style.color = gold;
              e.currentTarget.style.backgroundColor = "#FFFBF0";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = "#E5E5E5";
              e.currentTarget.style.color = dark;
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            {/* User Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Guest Visitor
          </Link>

          {/* ADMIN LINK */}
          <div className="flex justify-center mt-2">
            <Link
              to="/admin/login"
              className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1"
              onMouseOver={(e) => (e.currentTarget.style.color = gold)}
              onMouseOut={(e) => (e.currentTarget.style.color = "#9A9A9A")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              Admin Access
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}