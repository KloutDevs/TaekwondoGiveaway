import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function AnimatedTitle() {
  const blockRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (blockRef.current) {
      gsap.fromTo(
        blockRef.current,
        { y: -60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' }
      );
    }
    if (imgRef.current) {
      gsap.fromTo(
        imgRef.current,
        { scale: 0.8 },
        { scale: 1, duration: 1.2, ease: 'elastic.out(1, 0.5)' }
      );
    }
  }, []);

  return (
    <div
      ref={blockRef}
      className="relative flex items-center justify-center"
      style={{ minHeight: '8rem' }}
    >
      <span
        className="absolute left-0"
        style={{
          width: '8rem',
          height: '8rem',
          borderRadius: '50%',
          zIndex: 0,
          background: 'radial-gradient(circle, rgba(255,255,255,0.38) 0%, rgba(247,225,175,0.32) 30%, #a4180b 100%)',
          filter: 'blur(3px)',
        }}
      />
      <img
        ref={imgRef}
        src="/assets/woman.png"
        alt="Taekwondo Julieta Schmidt"
        className="w-32 h-32 object-contain z-10 rounded-full"
        loading="eager"
        style={{ background: '#fff3' }}
      />
      <div className="ml-6 flex flex-col justify-center z-10">
        <span className="text-[#f7e1af] font-bold text-base uppercase tracking-widest" style={{ letterSpacing: 2 }}>
          Taekwondo
        </span>
        <span
          className="animated-title-text text-[#f7e1af] font-extrabold leading-tight font-montserrat text-left drop-shadow-lg"
          style={{
            fontSize: '1.5rem', // base
            transition: 'font-size 0.2s',
            ...(typeof window === 'undefined' ? {} : {}), // SSR safe
          }}
        >
          Julieta Schmidt
        </span>
        <style>{`
          @media (min-width: 20rem) {
            .animated-title-text { font-size: 1.5rem !important; }
          }
          @media (min-width: 24rem) {
            .animated-title-text { font-size: 2rem !important; }
          }
          @media (min-width: 28rem) {
            .animated-title-text { font-size: 2.5rem !important; }
          }
        `}</style>
      </div>
    </div>
  );
} 