"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from 'next/navigation';

function getTimeSince(date: Date): { years: number; days: number; hours: number; minutes: number; seconds: number } {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000) % 60;
  const minutes = Math.floor(diff / (1000 * 60)) % 60;
  const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
  const years = now.getFullYear() - date.getFullYear() - (now < new Date(now.getFullYear(), date.getMonth(), date.getDate()) ? 1 : 0);
  const daysTotal = Math.floor(diff / (1000 * 60 * 60 * 24));
  const days = daysTotal - years * 365 - Math.floor(years / 4); // overflow days after years (approx, ignores leap year edge cases)
  return { years, days, hours, minutes, seconds };
}

function getTimeUntilNextBirthday(date: Date): { days: number; hours: number; minutes: number; seconds: number } {
  const now = new Date();
  let nextBirthday = new Date(now.getFullYear(), date.getMonth(), date.getDate());
  if (now >= nextBirthday) {
    nextBirthday = new Date(now.getFullYear() + 1, date.getMonth(), date.getDate());
  }
  const diff = nextBirthday.getTime() - now.getTime();
  const seconds = Math.floor(diff / 1000) % 60;
  const minutes = Math.floor(diff / (1000 * 60)) % 60;
  const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return { days, hours, minutes, seconds };
}

// FallingStars component
function FallingStars({ count = 40 }: { count?: number }) {
  const stars = Array.from({ length: count }).map((_, i) => {
    const left = Math.random() * 100; // percent
    const duration = 2 + Math.random() * 3; // 2-5s
    const delay = Math.random() * 5; // 0-5s
    const top = Math.random() * 100 - 10; // -10% to 90% of viewport height
    return (
      <div
        key={i}
        className="star"
        style={{
          left: `${left}%`,
          top: `${top}vh`,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
        }}
      />
    );
  });
  return <div className="falling-stars">{stars}</div>;
}

function HomeContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get('name') || 'Your name';
  const birthdateParam = searchParams.get('birthdate') || '1990-08-17';
  console.log(birthdateParam)
  const birthDate = new Date(birthdateParam + 'T00:00:00');

  const [time, setTime] = useState(getTimeSince(birthDate));
  const [timeToBirthday, setTimeToBirthday] = useState(getTimeUntilNextBirthday(birthDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeSince(birthDate));
      setTimeToBirthday(getTimeUntilNextBirthday(birthDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [birthDate]);

  return (
    <div
      className=""
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: '#000',
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative"
      }}
    >
      {/* Moon effect in the top-left corner */}
      <div style={{
        position: "absolute",
        top: typeof window !== 'undefined' && window.innerWidth < 600 ? -40 : -100,
        left: typeof window !== 'undefined' && window.innerWidth < 600 ? -40 : -100,
        width: typeof window !== 'undefined' && window.innerWidth < 600 ? 80 : 200,
        height: typeof window !== 'undefined' && window.innerWidth < 600 ? 80 : 200,
        borderRadius: "50%",
        background: "radial-gradient(circle at 60% 40%, #fffbe6 55%, #e0e0e0 70%, rgba(255,255,255,0.15) 85%, rgba(255,255,255,0) 100%)",
        boxShadow: typeof window !== 'undefined' && window.innerWidth < 600
          ? "0 0 40px 20px #fffbe6, 0 0 80px 40px #fffbe6a0, 0 0 120px 60px #fffbe600"
          : "0 0 120px 60px #fffbe6, 0 0 240px 120px #fffbe6a0, 0 0 400px 200px #fffbe600",
        zIndex: 2,
        opacity: 0.95
      }} />
      <FallingStars count={500} />
      {/* Overlay for readability */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.7)",
        zIndex: 0
      }} />
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 900, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: typeof window !== 'undefined' && window.innerWidth < 600 ? 8 : 0 }}>
        <div style={{ color: "#fff", fontWeight: 900, fontSize: typeof window !== 'undefined' && window.innerWidth < 600 ? 22 : 36, marginBottom: typeof window !== 'undefined' && window.innerWidth < 600 ? 16 : 32, letterSpacing: 2, textAlign: "center", textShadow: "0 2px 8px #000", fontFamily: 'Arial Black, Arial, sans-serif' }}>
          {name}
        </div>
        <div style={{ color: "#fff", fontWeight: "bold", letterSpacing: 2, marginBottom: typeof window !== 'undefined' && window.innerWidth < 600 ? 12 : 24, fontSize: typeof window !== 'undefined' && window.innerWidth < 600 ? 14 : 18 }}>TIME SINCE BIRTH:</div>
        <div style={{ display: "flex", flexWrap: typeof window !== 'undefined' && window.innerWidth < 600 ? 'wrap' : 'nowrap', gap: typeof window !== 'undefined' && window.innerWidth < 600 ? 12 : 32, marginBottom: typeof window !== 'undefined' && window.innerWidth < 600 ? 8 : 16, justifyContent: 'center' }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: typeof window !== 'undefined' && window.innerWidth < 600 ? 28 : 64, background: "#fff", color: "#333", borderRadius: 8, padding: typeof window !== 'undefined' && window.innerWidth < 600 ? '0 8px' : '0 24px', minWidth: typeof window !== 'undefined' && window.innerWidth < 600 ? 18 : 90, textAlign: "center", fontFamily: "monospace", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>{time.years}</div>
            <div style={{ color: "#fff", marginTop: 8, fontSize: typeof window !== 'undefined' && window.innerWidth < 600 ? 7 : 20 }}>Years</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: typeof window !== 'undefined' && window.innerWidth < 600 ? 28 : 64, background: "#fff", color: "#333", borderRadius: 8, padding: typeof window !== 'undefined' && window.innerWidth < 600 ? '0 8px' : '0 24px', minWidth: typeof window !== 'undefined' && window.innerWidth < 600 ? 18 : 90, textAlign: "center", fontFamily: "monospace", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>{time.days}</div>
            <div style={{ color: "#fff", marginTop: 8, fontSize: typeof window !== 'undefined' && window.innerWidth < 600 ? 7 : 20 }}>Days</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: typeof window !== 'undefined' && window.innerWidth < 600 ? 28 : 64, background: "#fff", color: "#333", borderRadius: 8, padding: typeof window !== 'undefined' && window.innerWidth < 600 ? '0 8px' : '0 24px', minWidth: typeof window !== 'undefined' && window.innerWidth < 600 ? 18 : 90, textAlign: "center", fontFamily: "monospace", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>{time.hours}</div>
            <div style={{ color: "#fff", marginTop: 8, fontSize: typeof window !== 'undefined' && window.innerWidth < 600 ? 7 : 20 }}>Hours</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: typeof window !== 'undefined' && window.innerWidth < 600 ? 28 : 64, background: "#fff", color: "#333", borderRadius: 8, padding: typeof window !== 'undefined' && window.innerWidth < 600 ? '0 8px' : '0 24px', minWidth: typeof window !== 'undefined' && window.innerWidth < 600 ? 18 : 90, textAlign: "center", fontFamily: "monospace", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>{time.minutes}</div>
            <div style={{ color: "#fff", marginTop: 8, fontSize: typeof window !== 'undefined' && window.innerWidth < 600 ? 7 : 20 }}>Minutes</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: typeof window !== 'undefined' && window.innerWidth < 600 ? 28 : 64, background: "#fff", color: "#333", borderRadius: 8, padding: typeof window !== 'undefined' && window.innerWidth < 600 ? '0 8px' : '0 24px', minWidth: typeof window !== 'undefined' && window.innerWidth < 600 ? 18 : 90, textAlign: "center", fontFamily: "monospace", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>{time.seconds}</div>
            <div style={{ color: "#fff", marginTop: 8, fontSize: typeof window !== 'undefined' && window.innerWidth < 600 ? 7 : 20 }}>Seconds</div>
          </div>
        </div>
        <div style={{ color: "#fff", fontSize: typeof window !== 'undefined' && window.innerWidth < 600 ? 14 : 24, marginTop: typeof window !== 'undefined' && window.innerWidth < 600 ? 12 : 24 }}>Your Age: <span style={{ fontWeight: "bold" }}>{time.years}</span> years</div>

        {/* Time until next birthday section */}
        <div style={{ color: "#fff", fontWeight: "bold", letterSpacing: 2, marginTop: typeof window !== 'undefined' && window.innerWidth < 600 ? 24 : 48, marginBottom: typeof window !== 'undefined' && window.innerWidth < 600 ? 12 : 24, fontSize: typeof window !== 'undefined' && window.innerWidth < 600 ? 14 : 18 }}>NEXT BIRTHDAY IN:</div>
        <div style={{ display: "flex", flexWrap: typeof window !== 'undefined' && window.innerWidth < 600 ? 'wrap' : 'nowrap', gap: typeof window !== 'undefined' && window.innerWidth < 600 ? 12 : 32, marginBottom: typeof window !== 'undefined' && window.innerWidth < 600 ? 8 : 16, justifyContent: 'center' }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: typeof window !== 'undefined' && window.innerWidth < 600 ? 28 : 64, background: "#fff", color: "#333", borderRadius: 8, padding: typeof window !== 'undefined' && window.innerWidth < 600 ? '0 8px' : '0 24px', minWidth: typeof window !== 'undefined' && window.innerWidth < 600 ? 18 : 90, textAlign: "center", fontFamily: "monospace", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>{timeToBirthday.days}</div>
            <div style={{ color: "#fff", marginTop: 8, fontSize: typeof window !== 'undefined' && window.innerWidth < 600 ? 7 : 20 }}>Days</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: typeof window !== 'undefined' && window.innerWidth < 600 ? 28 : 64, background: "#fff", color: "#333", borderRadius: 8, padding: typeof window !== 'undefined' && window.innerWidth < 600 ? '0 8px' : '0 24px', minWidth: typeof window !== 'undefined' && window.innerWidth < 600 ? 18 : 90, textAlign: "center", fontFamily: "monospace", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>{timeToBirthday.hours}</div>
            <div style={{ color: "#fff", marginTop: 8, fontSize: typeof window !== 'undefined' && window.innerWidth < 600 ? 7 : 20 }}>Hours</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: typeof window !== 'undefined' && window.innerWidth < 600 ? 28 : 64, background: "#fff", color: "#333", borderRadius: 8, padding: typeof window !== 'undefined' && window.innerWidth < 600 ? '0 8px' : '0 24px', minWidth: typeof window !== 'undefined' && window.innerWidth < 600 ? 18 : 90, textAlign: "center", fontFamily: "monospace", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>{timeToBirthday.minutes}</div>
            <div style={{ color: "#fff", marginTop: 8, fontSize: typeof window !== 'undefined' && window.innerWidth < 600 ? 7 : 20 }}>Minutes</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: typeof window !== 'undefined' && window.innerWidth < 600 ? 28 : 64, background: "#fff", color: "#333", borderRadius: 8, padding: typeof window !== 'undefined' && window.innerWidth < 600 ? '0 8px' : '0 24px', minWidth: typeof window !== 'undefined' && window.innerWidth < 600 ? 18 : 90, textAlign: "center", fontFamily: "monospace", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>{timeToBirthday.seconds}</div>
            <div style={{ color: "#fff", marginTop: 8, fontSize: typeof window !== 'undefined' && window.innerWidth < 600 ? 7 : 20 }}>Seconds</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}
