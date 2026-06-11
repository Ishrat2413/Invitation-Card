"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import StyledMap from "./components/StyledMap";

export default function Home() {
  const [showSurprise, setShowSurprise] = useState(true);

  const musicRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const weddingDate = new Date(2026, 5, 19, 18, 0, 0);

  // ---------- MUSIC (FIXED) ----------
  const startMusic = () => {
    const music = musicRef.current;
    if (music && music.paused) {
      music.volume = 0.4;
      music.play().catch((err) => console.log("Music autoplay blocked:", err));
    }
  };

  // Preload and try to play as soon as the page opens (after user click on envelope)
  useEffect(() => {
    if (!showSurprise) {
      // Small delay ensures the audio element is fully in DOM
      setTimeout(startMusic, 300);
    }
  }, [showSurprise]);

  // ---------- STARS (unchanged) ----------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let stars: Array<{
      x: number;
      y: number;
      r: number;
      speed: number;
      phase: number;
    }> = [];
    let frameTime = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      stars = [];
      for (let i = 0; i < 180; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.6 + 0.4,
          speed: Math.random() * 0.008 + 0.003,
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    const drawStars = (t: number) => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        const opacity = 0.3 + 0.7 * Math.abs(Math.sin(t * s.speed + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,240,${opacity})`;
        ctx.fill();
      });
      animationRef.current = requestAnimationFrame(drawStars);
    };

    const animate = (time: number) => {
      frameTime = time * 0.001;
      drawStars(frameTime);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  // ---------- PETALS (unchanged) ----------
  useEffect(() => {
    const petalSymbols = ["🌸", "🌺", "✿", "🌷", "❀", "🌹", "🥀"];
    const petalElements: HTMLDivElement[] = [];

    for (let i = 0; i < 28; i++) {
      const p = document.createElement("div");
      p.className = "petal";
      p.textContent = petalSymbols[i % petalSymbols.length];
      const dur = (Math.random() * 11 + 8).toFixed(1);
      p.style.cssText = `left:${Math.random() * 100}%;font-size:${Math.random() * 12 + 14}px;animation-duration:${dur}s;animation-delay:${(Math.random() * 12).toFixed(1)}s;`;
      document.body.appendChild(p);
      petalElements.push(p);
    }

    return () => petalElements.forEach((p) => p.remove());
  }, []);

  // ---------- COUNTDOWN (unchanged) ----------
  const updateCountdown = () => {
    const diff = weddingDate.getTime() - new Date().getTime();
    if (diff <= 0) {
      ["cd-d", "cd-h", "cd-m", "cd-s"].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.textContent = "00";
      });
      if (countdownIntervalRef.current)
        clearInterval(countdownIntervalRef.current);
      return;
    }
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    const daysEl = document.getElementById("cd-d");
    const hoursEl = document.getElementById("cd-h");
    const minutesEl = document.getElementById("cd-m");
    const secondsEl = document.getElementById("cd-s");
    if (daysEl) daysEl.textContent = String(days).padStart(2, "0");
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, "0");
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, "0");
  };

  useEffect(() => {
    updateCountdown();
    countdownIntervalRef.current = setInterval(updateCountdown, 1000);
    return () => {
      if (countdownIntervalRef.current)
        clearInterval(countdownIntervalRef.current);
    };
  }, []);

  // ---------- SCROLL REVEAL (unchanged) ----------
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.12 },
    );
    const revealElements = document.querySelectorAll(".reveal");
    revealElements.forEach((el) => observerRef.current?.observe(el));
    return () => observerRef.current?.disconnect();
  }, [showSurprise]);

  // ---------- OPEN INVITATION (unchanged except music call) ----------
  const openPage = () => {
    setShowSurprise(false);
    setTimeout(() => {
      startMusic(); // music starts after user click (browser allows autoplay)
      document
        .querySelectorAll(".reveal")
        .forEach((el) => observerRef.current?.observe(el));
    }, 100);
  };

  // ---------- JSX (unchanged except audio source) ----------
  return (
    <>
      <canvas
        ref={canvasRef}
        className='fixed inset-0 pointer-events-none z-0'
      />
      {/* WORKING MUSIC SOURCE – royalty‑free wedding piano */}
      <audio
        ref={musicRef}
        loop
        playsInline
        preload='auto'
        src='https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3'
      />

      {/* Surprise Screen */}
      <div
        className={`fixed inset-0 z-200 flex flex-col items-center justify-center text-center p-5 sm:p-8 transition-all duration-700 ${
          showSurprise ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        style={{
          background:
            "radial-gradient(ellipse at center, #1a0a10 0%, #0d0608 70%)",
        }}>
        <div className='relative w-[min(18rem,78vw)] aspect-[1.36/1] mb-10 animate-floatenv perspective-800'>
          <div className='absolute w-full h-full bg-linear-to-br from-[#b8841e] via-[#e8c96a] to-[#c9952a] rounded shadow-xl shadow-amber-700/50' />
          <div className='env-flap absolute w-0 h-0 border-l-56px border-r-56px border-t-48px sm:border-l-75px sm:border-r-75px sm:border-t-65px border-t-[#9a6c10] border-l-transparent border-r-transparent top-0 left-0 origin-top animate-flapopen' />
          <div className='absolute w-8 h-8 sm:w-9 sm:h-9 bg-[#c9952a] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-[#e8c96a] flex items-center justify-center text-[#0d0608] text-xs sm:text-sm'>
            ✦
          </div>
        </div>
        <div className='font-cinzel text-[clamp(11px,2.5vw,15px)] text-[#e8c96a] tracking-[0.35em] uppercase mb-2'>
          A special invitation for you
        </div>
        <div className='font-great-vibes text-[clamp(40px,10vw,74px)] text-[#c9952a] leading-tight mb-1'>
          Shoaib & Roshni
        </div>
        <div className='font-cormorant italic text-[clamp(14px,3vw,20px)] text-[#e8c96a]/65 mb-10'>
          19 June 2026 · Naz Garden, Bogura
        </div>
        <button
          onClick={openPage}
          className='bg-transparent border border-[#c9952a] text-[#e8c96a] font-cinzel text-xs tracking-[0.25em] py-4 px-11 uppercase transition-all duration-300 hover:bg-[#c9952a]/20 hover:shadow-amber-700/40 hover:shadow-lg hover:-translate-y-0.5'>
          Open the Invitation ✦
        </button>
      </div>

      {/* Main Page (rest of your content – unchanged) */}
      <div
        className={`relative z-2 ${showSurprise ? "hidden" : "block"} overflow-x-hidden`}>
        {/* Hero Section */}
        <section className='min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 py-14 sm:py-16 relative bg-[radial-gradient(ellipse_at_top,#1f0a14_0%,#0d0608_65%)]'>
          <div className='absolute bottom-0 left-0 right-0 h-50 bg-linear-to-t from-transparent to-[#0d0608] pointer-events-none' />
          <div className='font-eb-garamond text-[clamp(22px,5vw,38px)] text-[#c9952a] rtl mb-6 opacity-85 animate-fadeup'>
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </div>
          <div className='font-cinzel text-[clamp(9px,1.8vw,12px)] tracking-[0.4em] text-[#e8c96a] uppercase mb-6 opacity-70 animate-[fadeup_0.9s_0.15s_ease_both]'>
            The Wedding of
          </div>
          <div className='font-great-vibes text-[clamp(48px,10vw,90px)] text-[#faf6ee] leading-none animate-[fadeup_0.9s_0.25s_ease_both]'>
            Shoaib Islam Junayed
          </div>
          <span className='font-great-vibes text-[clamp(56px,11vw,100px)] text-[#c9952a] block animate-[fadeup_0.9s_0.35s_ease_both]'>
            &amp;
          </span>
          <div className='font-great-vibes text-[clamp(48px,10vw,90px)] text-[#faf6ee] leading-none animate-[fadeup_0.9s_0.45s_ease_both]'>
            <span className='font-cormorant italic text-[0.45em] text-[#e8c96a] align-middle mr-1'>
              Dr.
            </span>
            Fouzia Afrin Roshni
          </div>
          <div className='font-cinzel text-[clamp(13px,3vw,20px)] tracking-[0.18em] sm:tracking-[0.25em] text-[#e8c96a] my-5 sm:my-8 animate-[fadeup_0.9s_0.55s_ease_both]'>
            Friday · 19 June 2026
          </div>
          <div className='font-cormorant italic text-[clamp(14px,4.5vw,20px)] text-[#f3dfa4] mt-1 sm:mt-2 mb-10 sm:mb-16 px-3 max-w-[24rem] mx-auto leading-tight'>
            Naz Garden, Bogura, Bangladesh
          </div>
          <div className='mt-12 text-[#e8c96a]/40 text-[11px] tracking-[0.25em] uppercase font-cinzel animate-[fadeup_0.9s_0.8s_ease_both,bob_2s_1.8s_ease-in-out_infinite]'>
            ↓ &nbsp; Scroll to explore &nbsp; ↓
          </div>
        </section>

        {/* Couple Photos */}
        <section className='py-16 sm:py-20 px-4 sm:px-6 text-center bg-linear-to-b from-[#0d0608] via-[#1a0a10] to-[#0d0608] reveal'>
          <div className='font-cinzel text-[clamp(9px,1.8vw,11px)] tracking-[0.4em] text-[#c9952a] uppercase mb-10 opacity-80'>
            The Couple
          </div>
          <div className='flex flex-col lg:flex-row justify-center gap-10 lg:gap-8 max-w-205 mx-auto items-center lg:items-start'>
            <div className='w-full max-w-88 sm:max-w-[24rem] lg:flex-1 lg:max-w-85'>
              <div className='relative aspect-3/4 bg-[#1a0a10] border border-[#c9952a] overflow-hidden shadow-2xl before:absolute before:inset-2 before:border before:border-[#c9952a]/30 before:z-10 before:pointer-events-none'>
                <Image
                  src='/img1.jpg'
                  alt='Shoaib'
                  height={800}
                  width={600}
                  className='w-full h-full object-cover sepia-[0.15] contrast-105 brightness-105 transition-transform duration-700 hover:scale-105'
                />
              </div>
              <div className='mt-4'>
                <div className='font-great-vibes text-[clamp(26px,4vw,36px)] text-[#e8c96a]'>
                  Shoaib
                </div>
                <div className='font-cormorant italic text-[13px] text-[#7a5520] mt-0.5'>
                  Islam Junayed
                </div>
              </div>
            </div>
            <div className='flex items-center justify-center lg:pt-12'>
              <span className='font-great-vibes text-[clamp(60px,10vw,90px)] text-[#c9952a]'>
                &amp;
              </span>
            </div>
            <div className='w-full max-w-88 sm:max-w-[24rem] lg:flex-1 lg:max-w-85'>
              <div className='relative aspect-3/4 bg-[#1a0a10] border border-[#c9952a] overflow-hidden shadow-2xl before:absolute before:inset-2 before:border before:border-[#c9952a]/30 before:z-10 before:pointer-events-none'>
                <Image
                  src='/img2.jpg'
                  alt='Roshni'
                  height={800}
                  width={600}
                  className='w-full h-full object-cover sepia-[0.15] contrast-105 brightness-105 transition-transform duration-700 hover:scale-105'
                />
              </div>
              <div className='mt-4'>
                <div className='font-great-vibes text-[clamp(26px,4vw,36px)] text-[#e8c96a]'>
                  Roshni
                </div>
                <div className='font-cormorant italic text-[13px] text-[#7a5520] mt-0.5'>
                  Dr. Fouzia Afrin
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Memories Gallery */}
        <section className='py-16 sm:py-20 px-4 sm:px-6 text-center bg-linear-to-b from-[#1a0a10] to-[#0d0608] reveal'>
          <div className='font-cinzel text-[clamp(9px,1.8vw,11px)] tracking-[0.4em] text-[#c9952a] uppercase mb-10 opacity-80'>
            Memories
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-275 mx-auto'>
            {["First Meeting", "Engagement Day", "Family Gathering"].map(
              (title, idx) => (
                <div
                  key={idx}
                  className='relative rounded overflow-hidden shadow-2xl aspect-4/3 group'>
                  <Image
                    src={`/photo-${idx + 1}.jpg`}
                    alt={title}
                    height={600}
                    width={800}
                    className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
                  />
                  <div className='absolute bottom-0 left-0 right-0 bg-linear-to-t from-[#0d0608] to-transparent p-4 pb-3 text-[#e8c96a] font-cinzel text-[13px] tracking-[1px]'>
                    {title}
                  </div>
                </div>
              ),
            )}
          </div>
        </section>

        {/* Together Photo */}
        <section className='py-12 pb-18 sm:pb-20 px-4 sm:px-6 text-center bg-[#0d0608] reveal'>
          <div className='font-cinzel text-[clamp(9px,1.8vw,11px)] tracking-[0.4em] text-[#c9952a] uppercase mb-10 opacity-80'>
            Together
          </div>
          <div className='max-w-170 mx-auto relative border-2 border-[#c9952a] p-1 sm:p-1.5 bg-[#0d0608] shadow-2xl shadow-amber-900/20'>
            <Image
              src='/img4.png'
              alt='Shoaib & Roshni'
              height={500}
              width={1400}
              className='w-full block sepia-[0.12] contrast-108 border border-[#c9952a]/40'
            />
          </div>
          <div className='font-great-vibes text-[clamp(26px,5vw,44px)] text-[#c9952a] mt-6'>
            Two souls, one journey
          </div>
        </section>

        {/* Announcement */}
        <section className='py-16 sm:py-20 px-4 sm:px-6 text-center bg-[#faf6ee] relative reveal'>
          <div className='absolute top-0 left-0 right-0 h-0.75 bg-linear-to-r from-transparent via-[#c9952a] to-transparent' />
          <div className='absolute bottom-0 left-0 right-0 h-0.75 bg-linear-to-r from-transparent via-[#c9952a] to-transparent' />
          <div className='font-cinzel text-[clamp(9px,2vw,12px)] tracking-[0.35em] text-[#7a5520] uppercase mb-4'>
            With the grace of Allah
          </div>
          <div className='flex items-center gap-3 max-w-100 mx-auto mb-12'>
            <div className='flex-1 h-px bg-linear-to-r from-transparent via-[#c9952a] to-transparent' />
            <div className='w-2 h-2 bg-[#c9952a] rotate-45 shrink-0' />
            <div className='flex-1 h-px bg-linear-to-r from-transparent via-[#c9952a] to-transparent' />
          </div>
          <div className='font-playfair text-[clamp(28px,6vw,56px)] text-[#2a1200] leading-tight'>
            Shoaib Islam Junayed
            <br />
            <span className='font-great-vibes text-[clamp(52px,9vw,80px)] text-[#c9952a] block my-2'>
              &amp;
            </span>
            <span className='text-[0.55em] text-[#7a5520] italic'>Dr.</span>{" "}
            Fouzia Afrin Roshni
          </div>
          <div className='flex items-center gap-3 max-w-100 mx-auto my-8'>
            <div className='flex-1 h-px bg-linear-to-r from-transparent via-[#c9952a] to-transparent' />
            <div className='w-2 h-2 bg-[#c9952a] rotate-45 shrink-0' />
            <div className='flex-1 h-px bg-linear-to-r from-transparent via-[#c9952a] to-transparent' />
          </div>
          <p className='font-cormorant italic text-[clamp(15px,2.5vw,19px)] text-[#5a3a00] leading-relaxed max-w-125 mx-auto'>
            Together with their beloved families, joyfully invite you to
            celebrate
            <br />
            the sacred union of their hearts in holy matrimony.
            <br />
            <br />
            Your presence, blessings, and prayers
            <br />
            would make this day truly beautiful.
          </p>
          <blockquote className='font-eb-garamond italic text-[clamp(13px,2.2vw,16px)] text-[#7a5520] border-l-2 border-[#c9952a] py-3 px-6 max-w-105 mx-auto mt-8 text-left leading-relaxed'>
            &quot;And He placed between you affection and mercy. Indeed in that
            are signs for a people who give thought.&quot;
            <br />
            <em>— Surah Ar-Rum, 30:21</em>
          </blockquote>
        </section>

        {/* Events */}
        <section className='py-16 sm:py-20 px-4 sm:px-6 text-center bg-linear-to-b from-[#0d0608] via-[#1a0a10] to-[#0d0608] reveal'>
          <div className='font-cinzel text-[clamp(9px,1.8vw,11px)] tracking-[0.4em] text-[#e8c96a] uppercase mb-2'>
            The Celebrations
          </div>
          <div className='font-playfair italic text-[clamp(28px,5vw,46px)] text-[#faf6ee] mb-2'>
            Wedding Events
          </div>
          <div className='font-cormorant italic text-[clamp(14px,2.5vw,18px)] text-[#7a5520] mb-12'>
            Join us across these beautiful occasions
          </div>
          <div className='flex items-center gap-3 max-w-100 mx-auto mb-12'>
            <div className='flex-1 h-px bg-linear-to-r from-transparent via-[#c9952a] to-transparent' />
            <div className='w-2 h-2 bg-[#c9952a] rotate-45 shrink-0' />
            <div className='flex-1 h-px bg-linear-to-r from-transparent via-[#c9952a] to-transparent' />
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 max-w-225 mx-auto'>
            {[
              {
                name: "Gaye Holud",
                date: "18 June 2026",
                time: "Evening · 6:30 PM",
                venue: "Bride's Residence",
                icon: "🌼",
              },
              {
                name: "Akdh Nikah",
                date: "19 June 2026",
                time: "After Asr · ~4:30 PM",
                venue: "Naz Garden, Bogura",
                icon: "☪️",
              },
            ].map((e, i) => (
              <div
                key={i}
                className='border border-[#c9952a]/35 p-6 sm:p-8 relative bg-[#0d0608] transition-all hover:border-[#c9952a] hover:-translate-y-1 before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2 before:w-10 before:h-0.5 before:bg-[#c9952a]'>
                <div className='text-2xl sm:text-3xl mb-4'>{e.icon}</div>
                <div className='font-cinzel text-[clamp(12px,2vw,14px)] tracking-[0.2em] text-[#e8c96a] uppercase mb-3'>
                  {e.name}
                </div>
                <div className='font-playfair text-[clamp(18px,3vw,22px)] text-[#faf6ee] mb-1'>
                  {e.date}
                </div>
                <div className='font-cormorant italic text-[clamp(15px,3vw,18px)] text-[#dbb075]'>
                  {e.time}
                </div>
                <div className='font-cormorant italic text-[clamp(16px,3vw,16px)] text-[#dbb075] mt-2'>
                  {e.venue}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Countdown */}
        <section className='py-16 sm:py-20 px-4 sm:px-6 text-center bg-[#faf6ee] relative reveal'>
          <div className='absolute top-0 left-0 right-0 h-0.75 bg-linear-to-r from-transparent via-[#c9952a] to-transparent' />
          <div className='font-playfair italic text-[clamp(24px,4vw,38px)] text-[#2a1200] mb-1'>
            Counting Down
          </div>
          <div className='font-cormorant italic text-[clamp(13px,2.2vw,16px)] text-[#7a5520] mb-10'>
            Until Shoaib &amp; Roshni say &quot;Qabul&quot;
          </div>
          <div className='flex flex-wrap lg:flex-nowrap justify-center items-start sm:items-center gap-3 sm:gap-x-7 max-w-125 lg:max-w-none mx-auto'>
            <div className='w-[calc(50%-0.375rem)] sm:w-auto text-center flex-none'>
              <span
                id='cd-d'
                className='font-cinzel text-[clamp(40px,8vw,72px)] text-[#2a1200] block leading-none font-semibold'>
                00
              </span>
              <span className='font-cormorant text-[clamp(10px,1.8vw,13px)] tracking-[0.15em] text-[#7a5520] uppercase block mt-1'>
                Days
              </span>
            </div>
            <div className='hidden sm:block font-cinzel text-[clamp(30px,6vw,52px)] text-[#c9952a] pt-1'>
              :
            </div>
            <div className='w-[calc(50%-0.375rem)] sm:w-auto text-center flex-none'>
              <span
                id='cd-h'
                className='font-cinzel text-[clamp(40px,8vw,72px)] text-[#2a1200] block leading-none font-semibold'>
                00
              </span>
              <span className='font-cormorant text-[clamp(10px,1.8vw,13px)] tracking-[0.15em] text-[#7a5520] uppercase block mt-1'>
                Hours
              </span>
            </div>
            <div className='hidden sm:block font-cinzel text-[clamp(30px,6vw,52px)] text-[#c9952a] pt-1'>
              :
            </div>
            <div className='w-[calc(50%-0.375rem)] sm:w-auto text-center flex-none'>
              <span
                id='cd-m'
                className='font-cinzel text-[clamp(40px,8vw,72px)] text-[#2a1200] block leading-none font-semibold'>
                00
              </span>
              <span className='font-cormorant text-[clamp(10px,1.8vw,13px)] tracking-[0.15em] text-[#7a5520] uppercase block mt-1'>
                Mins
              </span>
            </div>
            <div className='hidden sm:block font-cinzel text-[clamp(30px,6vw,52px)] text-[#c9952a] pt-1'>
              :
            </div>
            <div className='w-[calc(50%-0.375rem)] sm:w-auto text-center flex-none'>
              <span
                id='cd-s'
                className='font-cinzel text-[clamp(40px,8vw,72px)] text-[#2a1200] block leading-none font-semibold'>
                00
              </span>
              <span className='font-cormorant text-[clamp(10px,1.8vw,13px)] tracking-[0.15em] text-[#7a5520] uppercase block mt-1'>
                Secs
              </span>
            </div>
          </div>
        </section>

        {/* Venue */}
        <section className='py-16 sm:py-20 px-4 sm:px-6 text-center bg-linear-to-b from-[#0d0608] to-[#1a0a10] reveal'>
          <div className='font-cinzel text-[clamp(9px,1.8vw,11px)] tracking-[0.4em] text-[#c9952a] uppercase mb-4'>
            Where it happens
          </div>
          <div className='flex items-center gap-3 max-w-100 mx-auto mb-8'>
            <div className='flex-1 h-px bg-linear-to-r from-transparent via-[#c9952a] to-transparent' />
            <div className='w-2 h-2 bg-[#c9952a] rotate-45 shrink-0' />
            <div className='flex-1 h-px bg-linear-to-r from-transparent via-[#c9952a] to-transparent' />
          </div>
          <div className='font-playfair text-[clamp(32px,7vw,64px)] text-[#faf6ee]'>
            <em className='text-[#c9952a] not-italic'>Naz</em> Garden
          </div>
          <div className='font-cormorant italic text-[clamp(14px,2.5vw,18px)] text-[#7a5520] mt-3'>
            Bogura, Bangladesh
          </div>
          <div className='max-w-250 mx-auto mt-10 aspect-16/11 sm:aspect-16/8 border border-[#c9952a]/30 overflow-hidden rounded-lg'>
            <StyledMap />
          </div>
          <div className='font-cormorant italic text-[clamp(12px,2vw,15px)] text-[#c9952a]/50 mt-6'>
            Directions will be shared closer to the date · Insha&apos;Allah
          </div>
        </section>

        {/* Footer */}
        <footer className='py-14 sm:py-16 px-4 sm:px-6 bg-[#0d0608] text-center relative'>
          <div className='absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#c9952a] to-transparent' />
          <div className='flex items-center gap-3 max-w-100 mx-auto mb-8'>
            <div className='flex-1 h-px bg-linear-to-r from-transparent via-[#c9952a] to-transparent' />
            <div className='w-2 h-2 bg-[#c9952a] rotate-45 shrink-0' />
            <div className='flex-1 h-px bg-linear-to-r from-transparent via-[#c9952a] to-transparent' />
          </div>
          <div className='font-great-vibes text-[clamp(40px,7vw,68px)] text-[#c9952a] mb-2'>
            Shoaib &amp; Roshni
          </div>
          <div className='font-cinzel text-[clamp(10px,2vw,13px)] tracking-[0.3em] text-[#e8c96a]/60 uppercase'>
            19 · June · 2026 &nbsp;·&nbsp; Naz Garden, Bogura
          </div>
          <div className='font-eb-garamond italic text-[clamp(12px,2vw,15px)] text-[#e8c96a]/45 mt-6 max-w-95 mx-auto leading-relaxed'>
            &quot;Our Lord, grant us from among our spouses and offspring
            comfort to our eyes,
            <br />
            and make us an example for the righteous.&quot;
            <br />— Surah Al-Furqan 25:74
          </div>
        </footer>
      </div>
    </>
  );
}
