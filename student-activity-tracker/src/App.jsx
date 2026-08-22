
export default function App() {

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-white font-sans">
      {/* Left Panel */}
      <section className="relative hidden lg:flex flex-col justify-between p-12 lg:p-16 bg-linear-to-b from-[#0b2575] via-[#091b54] to-[#040e2d] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-15 pointer-events-none" style={{backgroundImage : "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize : "28px 28px"}}/>
          {/* Brand Logo */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30"> 
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="current-color" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">OD TRACK</span>
          </div>
        <div className="relative z-10 my-auto py-8">
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            OD Management System
          </h1>
          <p className="mt-4 text-sm sm:text-base text-blue-200/80 max-w-lg leading-relaxed">
            Automate college on-duty requests, approvals, and tracking with instant notifications and high-level role clearance flows.
          </p>
        </div>
      </section>
    </div>
  )
}

