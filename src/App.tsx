import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

interface Zikr {
  arabic: string;
  transliteration: string;
  translation: string;
  count?: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  delay: number;
}

const azkarList: Zikr[] = [
  {
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    transliteration: 'Subhan Allahi wa bihamdihi',
    translation: 'Glory be to Allah and praise Him',
    count: 100
  },
  {
    arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
    transliteration: 'La ilaha illa Allah wahdahu la sharika lah',
    translation: 'There is no deity except Allah, alone without partner',
    count: 10
  },
  {
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ',
    transliteration: 'Allahumma salli ala Muhammad wa ala ali Muhammad',
    translation: 'O Allah, send blessings upon Muhammad and his family'
  },
  {
    arabic: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
    transliteration: 'Astaghfirullah wa atubu ilayh',
    translation: 'I seek forgiveness from Allah and repent to Him',
    count: 100
  },
  {
    arabic: 'سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَٰهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ',
    transliteration: 'Subhan Allah wal hamdu lillah wa la ilaha illa Allah wa Allahu Akbar',
    translation: 'Glory be to Allah, praise be to Allah, there is no deity except Allah, and Allah is the Greatest'
  },
  {
    arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    transliteration: 'La hawla wa la quwwata illa billah',
    translation: 'There is no power nor strength except with Allah'
  },
  {
    arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
    transliteration: 'Hasbunallahu wa ni\'mal wakeel',
    translation: 'Allah is sufficient for us, and He is the best Disposer of affairs'
  },
  {
    arabic: 'رَبِّ اغْفِرْ لِي وَارْحَمْنِي',
    transliteration: 'Rabbi ghfir li war hamni',
    translation: 'My Lord, forgive me and have mercy upon me'
  }
];

const getHijriDate = () => {
  const gregorianDate = new Date();
  const year = gregorianDate.getFullYear();
  const month = gregorianDate.getMonth() + 1;
  const day = gregorianDate.getDate();

  let hijriYear = year - 579;
  let hijriMonth = month;
  let hijriDay = day - 1;

  if (hijriMonth <= 2) {
    hijriYear -= 1;
  }

  const monthNames = [
    'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني',
    'جمادى الأولى', 'جمادى الثانية', 'رجب', 'شعبان',
    'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
  ];

  const hijriMonthName = monthNames[hijriMonth - 1];
  return `${hijriDay} ${hijriMonthName} ${hijriYear} هـ`;
};

function App() {
  const [currentZikr, setCurrentZikr] = useState<Zikr>(azkarList[0]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [count, setCount] = useState(0);
  const [hijriDate, setHijriDate] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [particleId, setParticleId] = useState(0);

  useEffect(() => {
    setHijriDate(getHijriDate());
  }, []);

  const getRandomZikr = () => {
    setIsAnimating(true);
    setCount(0);
    setShowCelebration(false);
    setParticles([]);

    setTimeout(() => {
      let newZikr;
      do {
        newZikr = azkarList[Math.floor(Math.random() * azkarList.length)];
      } while (newZikr === currentZikr && azkarList.length > 1);

      setCurrentZikr(newZikr);
      setIsAnimating(false);
    }, 200);
  };

  const handleZikrClick = () => {
    const newCount = count + 1;
    setCount(newCount);

    const targetCount = currentZikr.count || 100;

    if (newCount >= targetCount) {
      setShowCelebration(true);
      triggerCelebration();

      setTimeout(() => {
        setShowCelebration(false);
      }, 2000);
    }
  };

  const triggerCelebration = () => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 30; i++) {
      newParticles.push({
        id: particleId + i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 0.3
      });
    }
    setParticles(newParticles);
    setParticleId(particleId + 30);
  };

  const targetCount = currentZikr.count || 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (count / Math.max(targetCount, 1)) * circumference;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex flex-col overflow-hidden">
      <style>{`
        @keyframes celebrationFloat {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) scale(0);
            opacity: 0;
          }
        }
        .celebration-particle {
          animation: celebrationFloat 2s ease-in forwards;
        }
      `}</style>

      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="celebration-particle absolute text-3xl"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                animationDelay: `${particle.delay}s`
              }}
            >
              ✨
            </div>
          ))}
        </div>
      )}

      <div className="bg-white bg-opacity-60 backdrop-blur-sm shadow-sm py-4 text-center">
        <p className="text-amber-900 font-semibold text-lg">{hijriDate}</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="relative mb-8 flex justify-center">
            {targetCount > 0 && (
              <svg width="150" height="150" className="transform -rotate-90">
                <circle
                  cx="75"
                  cy="75"
                  r="45"
                  stroke="#fecaca"
                  strokeWidth="3"
                  fill="none"
                />
                <circle
                  cx="75"
                  cy="75"
                  r="45"
                  stroke="#ea580c"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
              </svg>
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className={`font-bold transition-all duration-300 ${showCelebration ? 'text-4xl text-green-600 scale-125' : 'text-3xl text-amber-900'}`}>
                {count}
              </p>
              {targetCount > 0 && (
                <p className="text-sm text-amber-700">/ {targetCount}</p>
              )}
            </div>
          </div>

          <div
            onClick={handleZikrClick}
            className={`bg-white rounded-3xl shadow-2xl p-8 min-h-[300px] flex flex-col justify-center transition-all duration-300 cursor-pointer hover:shadow-3xl active:scale-98 ${
              showCelebration ? 'scale-105 ring-4 ring-green-400' : ''
            }`}
          >
            <div className={`transition-opacity duration-200 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
              <div className="text-center mb-6">
                <p className="text-4xl leading-relaxed text-amber-900 font-semibold mb-6" style={{ fontFamily: 'system-ui' }}>
                  {currentZikr.arabic}
                </p>
              </div>

              <div className="space-y-3 text-center">
                <p className="text-lg text-amber-800 italic">
                  {currentZikr.transliteration}
                </p>
                <p className="text-base text-gray-600">
                  {currentZikr.translation}
                </p>
              </div>
            </div>

            {showCelebration && (
              <div className="text-center mt-4 text-lg font-bold text-green-600 animate-bounce">
                ما شاء الله! 🎉
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white bg-opacity-60 backdrop-blur-sm shadow-2xl p-4">
        <button
          onClick={getRandomZikr}
          className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg transition-all duration-300 flex items-center justify-center gap-3 active:scale-95"
        >
          <RefreshCw className="w-5 h-5" />
          الذكر التالي
        </button>
      </div>
    </div>
  );
}

export default App;
