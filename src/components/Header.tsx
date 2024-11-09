import React, { useEffect, useRef } from "react";

interface ParticleOptions {
  mean?: number;
  dev?: number;
}

interface Particle {
  x: number;
  y: number;
  note: string;
  fontSize: number;
  duration: number;
  amplitude: number;
  offsetY: number;
  arc: number;
  startTime: number;
  colour: string;
}

const ParticleBanner = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  const NUM_PARTICLES = 40;
  const PARTICLE_SIZE = 0.5;
  const SPEED = 20000;

  const randomNormal = (opts: ParticleOptions) => {
    const { mean = 0, dev = 1 } = opts;
    let a: number, b: number, r: number, e: number;
    do {
      a = 2 * Math.random() - 1;
      b = 2 * Math.random() - 1;
      r = a * a + b * b;
    } while (r >= 1);
    e = a * Math.sqrt((-2 * Math.log(r)) / r);
    return dev * e + mean;
  };

  const rand = (low: number, high: number): number => {
    return Math.random() * (high - low) + low;
  };

  const createParticle = (canvas: HTMLCanvasElement): Particle => {
    const colour = {
      r: 147,
      g: 51,
      b: 234,
      a: rand(0.3, 0.8),
    };

    const notes = ["♪", "♫", "♬", "♩", "𝄞", "𝅗𝅥", "𝄢"];
    const note = notes[Math.floor(Math.random() * notes.length)];

    return {
      x: -2,
      y: -2,
      note,
      fontSize: Math.max(
        0,
        randomNormal({ mean: PARTICLE_SIZE * 30, dev: PARTICLE_SIZE * 10 })
      ),
      duration: randomNormal({ mean: SPEED, dev: SPEED * 0.1 }),
      amplitude: randomNormal({ mean: 16, dev: 2 }),
      offsetY: randomNormal({ mean: 0, dev: 10 }),
      arc: Math.PI * 2,
      startTime: performance.now() - rand(0, SPEED),
      colour: `rgba(${colour.r}, ${colour.g}, ${colour.b}, ${colour.a})`,
    };
  };

  const moveParticle = (
    particle: Particle,
    canvas: HTMLCanvasElement,
    time: number
  ): Particle => {
    const progress =
      ((time - particle.startTime) % particle.duration) / particle.duration;
    return {
      ...particle,
      x: progress,
      y:
        Math.sin(progress * particle.arc) * particle.amplitude +
        particle.offsetY,
    };
  };

  const drawParticle = (
    particle: Particle,
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
  ) => {
    const vh = canvas.height / 100;
    ctx.fillStyle = particle.colour;
    ctx.font = `${particle.fontSize}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      particle.note,
      particle.x * canvas.width,
      particle.y * vh + canvas.height / 2
    );
  };

  const draw = (
    time: number,
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
  ) => {
    particlesRef.current = particlesRef.current.map((particle) =>
      moveParticle(particle, canvas, time)
    );

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesRef.current.forEach((particle) => {
      drawParticle(particle, canvas, ctx);
    });

    requestAnimationFrame((time) => draw(time, canvas, ctx));
  };

  const initializeCanvas = (
    canvas: HTMLCanvasElement
  ): CanvasRenderingContext2D => {
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Could not get canvas context");
    return context;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = initializeCanvas(canvas);

    particlesRef.current = Array.from({ length: NUM_PARTICLES }, () =>
      createParticle(canvas)
    );

    requestAnimationFrame((time) => draw(time, canvas, ctx));

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="relative w-full">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-64 bg-[#18181b]"
      />
      <div className="relative z-10">
        <div className="flex items-center justify-between px-4 py-2 max-w-screen-xl mx-auto w-full flex-wrap">
          <div className="w-full flex justify-center items-center gap-4 mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden transform hover:scale-110 transition-transform duration-300 hover:rotate-3 hover:shadow-lg hover:shadow-purple-500/50">
              <img
                src="/logo.jpeg"
                alt="VibeChain Logo"
                className="w-full h-full object-cover animate-spin-slow hover:animate-none"
              />
            </div>
            <h1 className="text-7xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent animate-pulse hover:animate-none hover:from-purple-600 hover:to-blue-400 transition-colors duration-500 font-['Lexend']">
              VibeChain
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticleBanner;
