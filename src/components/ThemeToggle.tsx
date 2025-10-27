import { useState, useEffect, useRef } from 'react';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme-preference');
    return saved === 'dark';
  });
  const [mouseDistance, setMouseDistance] = useState(1); // 0 = close, 1 = far
  const [isHovering, setIsHovering] = useState(false);
  const toggleRef = useRef<HTMLDivElement>(null);

  // Apply theme to document root
  useEffect(() => {
    const root = document.documentElement;
    const newTheme = isDark ? 't-dark' : 't-light';

    root.style.transition = 'background-color 0.8s ease-in-out, color 0.8s ease-in-out';
    root.className = newTheme;
    localStorage.setItem('theme-preference', isDark ? 'dark' : 'light');

    const timer = setTimeout(() => {
      root.style.transition = '';
    }, 800);

    return () => clearTimeout(timer);
  }, [isDark]);

  // Track mouse proximity for particle opacity
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!toggleRef.current) return;

      const rect = toggleRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // 0px = fully visible (0), 200px+ = barely visible (1)
      const maxDistance = 200;
      const normalizedDistance = Math.min(distance / maxDistance, 1);

      setMouseDistance(normalizedDistance);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleToggle = () => {
    setIsDark(!isDark);
  };

  // Calculate particle opacity based on proximity
  const proximityFactor = 1 - mouseDistance;
  const particleOpacity = 0.15 + (proximityFactor * 0.45);

  // Particle positions - spread naturally around the toggle
  const particles = [
    { left: -80, top: -40, size: 8, delay: 0, duration: 4 },
    { left: -60, top: 20, size: 12, delay: 0.5, duration: 5 },
    { left: -40, top: -20, size: 16, delay: 1, duration: 6 },
    { left: 60, top: -30, size: 10, delay: 1.5, duration: 4.5 },
    { left: 80, top: 10, size: 12, delay: 2, duration: 5.5 },
    { left: 100, top: -10, size: 8, delay: 2.5, duration: 4 },
    { left: -100, top: 0, size: 14, delay: 3, duration: 6 },
    { left: 0, top: 40, size: 10, delay: 3.5, duration: 5 },
  ];

  return (
    <div className="relative flex items-center gap-3">
      {/* Particle container - positioned absolutely within parent */}
      <div className="absolute inset-0 pointer-events-none" style={{ transform: 'translate(0, 0)' }}>
        {particles.map((particle, index) => (
          <div
            key={index}
            className={`absolute rounded-full blur-sm transition-all duration-700 ${isDark
                ? 'bg-gradient-to-br from-indigo-400 to-purple-500'
                : 'bg-gradient-to-br from-amber-400 to-orange-500'
              }`}
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `calc(50% + ${particle.left}px)`,
              top: `calc(50% + ${particle.top}px)`,
              opacity: particleOpacity,
              animation: isHovering
                ? `float ${particle.duration}s ease-in-out infinite`
                : 'none',
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Toggle Switch */}
      <div
        ref={toggleRef}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="relative z-10"
      >
        <label className="relative inline-flex cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={isDark}
            onChange={handleToggle}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          />

          {/* Glow Effects */}
          <div className="pointer-events-none absolute w-10 h-6 -z-10 rounded-full blur-md opacity-80 transition-all duration-700 ease-in-out peer-checked:from-indigo-500 peer-checked:via-purple-600 peer-checked:to-blue-700 from-amber-700 via-orange-700 to-yellow-500 bg-gradient-to-br" />

          {/* Track */}
          <div className="relative w-10 h-6 rounded-full overflow-hidden transition-all duration-700 ease-in-out hover:scale-105 bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-100 peer-checked:from-slate-900 peer-checked:via-indigo-950 peer-checked:to-purple-950 peer-checked:shadow-[0_4px_20px_-2px_rgba(99,102,241,0.4)] shadow-[0_4px_20px_-2px_rgba(251,191,36,0.4)]">
            {/* Shimmer effect */}
            <div className="absolute blur-md inset-0 hover:transition-all bg-gradient-to-r from-transparent via-white/15 to-transparent bg-[length:200%_100%] animate-[shimmer_3s_ease-in-out_infinite]" />

            {/* Thumb */}
            <div
              className={`absolute w-[16px] h-[16px] left-[3px] top-[3px] rounded-full transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] shadow-[inset_0_-2px_4px_rgba(0,0,0,0.15),0_2px_8px_rgba(0,0,0,0.2)] bg-gradient-to-br ${
                isDark
                  ? 'translate-x-4 rotate-180 from-indigo-600 via-purple-500 to-blue-500'
                  : 'translate-x-0 rotate-0 from-amber-400/90 via-orange-400/75 to-yellow-500'
              }`}
            >
              {/* Icon */}
              <div className="absolute inset-0 flex items-center justify-center text-white text-[10px]">
                {isDark ? '' : '☀️'}
              </div>
            </div>
          </div>
        </label>
      </div>

      {/* Label */}
      <label
        htmlFor="theme-toggle"
        className="relative z-10 cursor-pointer select-none text-sm font-medium transition-transform duration-300 hover:scale-105"
      >
        <span className={`inline-block text-transparent bg-clip-text bg-gradient-to-r ${isDark
            ? 'from-indigo-400/80 via-purple-500/90 to-blue-500/90'
            : 'from-amber-400/90 via-orange-400/75 to-yellow-500'
          }`}>
          {isDark ? '🌙 Dark' : 'Light'}
        </span>
      </label>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(10px, -10px) scale(1.1);
          }
          50% {
            transform: translate(-5px, 5px) scale(0.9);
          }
          75% {
            transform: translate(-10px, -5px) scale(1.05);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
};

export default ThemeToggle;
