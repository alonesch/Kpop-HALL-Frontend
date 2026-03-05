"use client"

export function KpopBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      {/* Main purple gradient background */}
      <div className="absolute inset-0 bg-[#7B5EA7]" />

      {/* Abstract organic shapes */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 390 844"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Dark curved shape top-left */}
        <path
          d="M-30 0C-30 0 20 80 60 120C100 160 40 220 0 260C-40 300 -60 280 -80 320L-80 0Z"
          fill="#2D1B3D"
          opacity="0.7"
        />
        {/* Large blob center-left */}
        <path
          d="M-20 200C40 180 80 220 100 280C120 340 60 380 20 400C-20 420 -60 380 -60 320C-60 260 -80 220 -20 200Z"
          fill="#2D1B3D"
          opacity="0.5"
        />
        {/* Magenta shape bottom-right */}
        <path
          d="M300 600C340 560 400 580 420 640C440 700 400 760 360 780C320 800 260 780 240 740C220 700 260 640 300 600Z"
          fill="#9B2D7B"
          opacity="0.6"
        />
        {/* Bottom magenta wave */}
        <path
          d="M0 700C60 680 140 720 200 740C260 760 320 730 390 750L390 844L0 844Z"
          fill="#8B2A6B"
          opacity="0.5"
        />
        {/* Dark shape bottom-left */}
        <path
          d="M-40 600C0 580 60 620 80 680C100 740 40 800 -20 820L-80 844L-80 600Z"
          fill="#2D1B3D"
          opacity="0.6"
        />
        {/* Top-right magenta accent */}
        <path
          d="M350 50C380 30 420 60 410 100C400 140 360 150 340 130C320 110 320 70 350 50Z"
          fill="#9B2D7B"
          opacity="0.4"
        />
        {/* Dark outline curves */}
        <path
          d="M-10 150C30 130 70 160 90 200C110 240 80 280 40 290C0 300 -30 270 -30 230C-30 190 -50 170 -10 150Z"
          fill="none"
          stroke="#2D1B3D"
          strokeWidth="2"
          opacity="0.4"
        />
        <path
          d="M280 650C310 630 350 660 340 700C330 740 290 750 270 730C250 710 250 670 280 650Z"
          fill="none"
          stroke="#2D1B3D"
          strokeWidth="2"
          opacity="0.4"
        />
      </svg>

      {/* Sparkle dots */}
      <div className="absolute top-[30%] right-[20%] h-2 w-2 rounded-full bg-[#D4A0D4] opacity-60" />
      <div className="absolute top-[45%] right-[30%] h-1.5 w-1.5 rounded-full bg-[#E0B0E0] opacity-40" />
      <div className="absolute bottom-[25%] right-[15%] h-2.5 w-2.5 rounded-full bg-[#C890C8] opacity-50" />
      <div className="absolute bottom-[35%] left-[25%] h-1 w-1 rounded-full bg-[#D4A0D4] opacity-30" />
      <div className="absolute top-[60%] right-[40%] h-1.5 w-1.5 rounded-full bg-[#E0B0E0] opacity-45" />
    </div>
  )
}
