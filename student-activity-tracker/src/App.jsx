
export default function App() {

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-white font-sans">
      {/* Left Panel */}
      <section className="relative hidden lg:flex flex-col justify-between p-12 lg:p-16 bg-linear-to-b from-[#0b2575] via-[#091b54] to-[#040e2d] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-15 pointer-events-none" style={{backgroundImage : "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize : "28px 28px"}}/>
          {/* Brand Logo */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30"> 
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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
          <div className="relative mt-12 h-72 w-full max-w-md">
            <div className="absolute top-0 left-0 w-64 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex justify-center items-center w-8 h-8 rounded-full bg-blue-500">A</div>
                  <span className="text-xs font-medium text-white/90">Aravind Sharma</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Approved
                </span>
              </div>
              <div className="mt-3">
                <p className="text-xs font-semibold text-white">
                  National Hackathon OD
                </p>
                <p className="text-[10px] text-blue-200/70 mt-0.5">
                  3 Days • Academic
                </p>
              </div>
            </div>
            <div className="absolute top-14 right-0 w-64 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-xl z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className=" flex justify-center items-center bg-indigo-500 rounded-full w-8 h-8">
                    P
                  </div>
                  <span className="text-xs font-medium text-white/90">
                    Priya Patel
                  </span>
                </div>
                <div className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  Pending
                </div>
              </div>
              <p className="text-xs font-semibold text-white mt-3">
                Inter College Football
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

