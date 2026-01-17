import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Settings, X, Menu } from 'lucide-react';

interface Zikr {
  arabic: string;
  transliteration: string;
  translation: string;
  count?: number;
  preferredTime?: 'friday' | 'morning' | 'afternoon' | 'evening' | 'night' | 'any';
  reason?: string;
  benefit?: string;
}

interface MorningEveningZikr {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  time: 'morning' | 'evening';
}

interface Particle {
  id: number;
  x: number;
  y: number;
  delay: number;
}

const morningEveningAzkar: MorningEveningZikr[] = [
  {
    id: 'morning-1',
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ',
    transliteration: 'Asbahna wa asbahal mulku lillah',
    translation: 'We have reached the morning and at this very time all sovereignty belongs to Allah',
    time: 'morning'
  },
  {
    id: 'morning-2',
    arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا',
    transliteration: 'Allahumma bika asbahna wa bika amsayna',
    translation: 'O Allah, by You we enter the morning and by You we enter the evening',
    time: 'morning'
  },
  {
    id: 'evening-1',
    arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ',
    transliteration: 'Amsayna wa amsal mulku lillah',
    translation: 'We have reached the evening and at this very time all sovereignty belongs to Allah',
    time: 'evening'
  },
  {
    id: 'evening-2',
    arabic: 'اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا',
    transliteration: 'Allahumma bika amsayna wa bika asbahna',
    translation: 'O Allah, by You we enter the evening and by You we enter the morning',
    time: 'evening'
  }
];

const azkarList: Zikr[] = [
  {
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    transliteration: 'Subhan Allahi wa bihamdihi',
    translation: 'Glory be to Allah and praise Him',
    preferredTime: 'morning',
    reason: 'تنزيه الله عن النقائص وحمده على نعمه',
    benefit: 'يملأ الميزان ويرفع الدرجات'
  },
  {
    arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
    transliteration: 'La ilaha illa Allah wahdahu la sharika lah',
    translation: 'There is no deity except Allah, alone without partner',
    preferredTime: 'any',
    reason: 'التوحيد والإقرار بوحدانية الله',
    benefit: 'أعظم الذكر وأحب الأعمال إلى الله'
  },
  {
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ',
    transliteration: 'Allahumma salli ala Muhammad wa ala ali Muhammad',
    translation: 'O Allah, send blessings upon Muhammad and his family',
    preferredTime: 'friday',
    reason: 'الصلاة على النبي وأتباعه والدعاء له',
    benefit: 'الصلاة على النبي تغفر الذنوب وتكفر السيئات'
  },
  {
    arabic: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
    transliteration: 'Astaghfirullah wa atubu ilayh',
    translation: 'I seek forgiveness from Allah and repent to Him',
    preferredTime: 'night',
    reason: 'الاستغفار من الذنوب والتوبة إلى الله',
    benefit: 'يفتح أبواب الرحمة ويمحو الذنوب'
  },
  {
    arabic: 'سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَٰهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ',
    transliteration: 'Subhan Allah wal hamdu lillah wa la ilaha illa Allah wa Allahu Akbar',
    translation: 'Glory be to Allah, praise be to Allah, there is no deity except Allah, and Allah is the Greatest',
    preferredTime: 'morning',
    reason: 'جمع بين التسبيح والتحميد والتوحيد والتكبير',
    benefit: 'تحت العرش في السماء السابعة وتثقل الميزان'
  },
  {
    arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    transliteration: 'La hawla wa la quwwata illa billah',
    translation: 'There is no power nor strength except with Allah',
    preferredTime: 'any',
    reason: 'كلمة من أعظم الأذكار تعبر عن الإقرار بربوبية الله وإلهيته وأسمائه وصفاته، تعني أن العبد لا يملك من أمره شيئًا، ولا حيلة له في دفع الشر أو جلب الخير إلا بإرادة الله وتوفيقه. قال النبي ﷺ: يا عبد الله بن قيس، ألا أدلك على كلمة من كنوز الجنة؟ قل: لا حول ولا قوة إلا بالله',
    benefit: 'كنز من كنوز الجنة ومفتاح للفرج والنجاة من الضيق والشدائد'
  },
  {
    arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
    transliteration: 'Hasbunallahu wa ni\'mal wakeel',
    translation: 'Allah is sufficient for us, and He is the best Disposer of affairs',
    preferredTime: 'afternoon',
    reason: 'التوكل على الله والثقة به في الأمور',
    benefit: 'يكفي المسلم شر ما يقلقه ويوفقه للخير'
  },
  {
    arabic: 'رَبِّ اغْفِرْ لِي وَارْحَمْنِي',
    transliteration: 'Rabbi ghfir li war hamni',
    translation: 'My Lord, forgive me and have mercy upon me',
    preferredTime: 'night',
    reason: 'الدعاء بالمغفرة والرحمة من الله',
    benefit: 'يجلب غفران الله ورحمته على العبد'
  },
  {
    arabic: 'اللَّهُمَّ بَارِكْ لَنَا فِي يَوْمِنَا هَذَا',
    transliteration: 'Allahumma barik lana fi yawmina hadha',
    translation: 'O Allah, bless us on this day',
    preferredTime: 'friday',
    reason: 'الدعاء بالبركة في اليوم والأعمال',
    benefit: 'تحل البركة في الوقت والعمل والرزق'
  },
  {
    arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    transliteration: 'Rabbana atina fi dunya hasanatan wa fi akhirati hasanatan wa qina adhaban nar',
    translation: 'Our Lord, give us good in this world and good in the Hereafter, and save us from the punishment of the Fire',
    preferredTime: 'evening',
    reason: 'الدعاء بالخير في الدنيا والآخرة والنجاة من النار',
    benefit: 'يجلب الخير من كل جانب والحماية من العذاب'
  }
];

const getHijriDate = () => {
  const gregorianDate = new Date();
  const year = gregorianDate.getFullYear();
  const month = gregorianDate.getMonth() + 1;
  const day = gregorianDate.getDate();

  // Convert Gregorian to Julian Day Number (accurate algorithm)
  let jdn: number;
  if (month <= 2) {
    jdn = Math.floor(365.25 * (year - 1)) + Math.floor(30.6001 * (month + 12 + 1)) + day + 1720994.5;
  } else {
    jdn = Math.floor(365.25 * year) + Math.floor(30.6001 * (month + 1)) + day + 1720994.5;
  }
  
  // Adjust for Gregorian calendar
  const a = Math.floor(year / 100);
  const b = 2 - a + Math.floor(a / 4);
  jdn += b;

  // Hijri epoch: July 16, 622 CE = Julian Day 1948439.5
  const hijriEpoch = 1948439.5;
  const daysSinceEpoch = Math.floor(jdn - hijriEpoch);
  
  // Calculate Hijri year
  let hijriYear = Math.floor((daysSinceEpoch * 30 + 10646) / 10631) + 1;
  
  // Calculate exact days from epoch to start of this Hijri year
  let totalDays = 0;
  for (let hy = 1; hy < hijriYear; hy++) {
    // Leap years in 30-year cycle: years 2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29
    const cyclePos = (hy - 1) % 30;
    const leapPositions = [1, 4, 6, 9, 12, 15, 17, 20, 23, 25, 28];
    const isLeap = leapPositions.includes(cyclePos);
    totalDays += isLeap ? 355 : 354;
  }
  
  // Binary search to find correct year
  let low = 1;
  let high = hijriYear + 1;
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    let days = 0;
    for (let hy = 1; hy < mid; hy++) {
      const cyclePos = (hy - 1) % 30;
      const leapPositions = [1, 4, 6, 9, 12, 15, 17, 20, 23, 25, 28];
      const isLeap = leapPositions.includes(cyclePos);
      days += isLeap ? 355 : 354;
    }
    if (days <= daysSinceEpoch) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  hijriYear = low - 1;
  
  // Recalculate totalDays for correct year
  totalDays = 0;
  for (let hy = 1; hy < hijriYear; hy++) {
    const cyclePos = (hy - 1) % 30;
    const leapPositions = [1, 4, 6, 9, 12, 15, 17, 20, 23, 25, 28];
    const isLeap = leapPositions.includes(cyclePos);
    totalDays += isLeap ? 355 : 354;
  }
  
  // Calculate remaining days in current Hijri year
  let remainingDays = daysSinceEpoch - totalDays;
  
  // Determine if current year is leap
  const cyclePos = (hijriYear - 1) % 30;
  const leapPositions = [1, 4, 6, 9, 12, 15, 17, 20, 23, 25, 28];
  const isLeapYear = leapPositions.includes(cyclePos);
  
  // Month lengths: 30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, (29 or 30)
  const monthLengths = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, isLeapYear ? 30 : 29];
  
  // Find the month
  let hijriMonth = 1;
  let monthDays = 0;
  for (let i = 0; i < 12; i++) {
    if (monthDays + monthLengths[i] > remainingDays) {
      hijriMonth = i + 1;
      break;
    }
    monthDays += monthLengths[i];
  }
  
  // Calculate day
  let hijriDay = remainingDays - monthDays + 1;
  
  // Ensure valid day range
  if (hijriDay < 1) hijriDay = 1;
  const maxDay = monthLengths[hijriMonth - 1];
  if (hijriDay > maxDay) hijriDay = maxDay;

  const monthNames = [
    'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني',
    'جمادى الأولى', 'جمادى الثانية', 'رجب', 'شعبان',
    'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
  ];

  const hijriMonthName = monthNames[hijriMonth - 1] || monthNames[0];
  return `${Math.floor(hijriDay)} ${hijriMonthName} ${hijriYear} هـ`;
};

const getCurrentTime = () => {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  // Convert to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12
  
  return `${hours.toString()}:${minutes.toString().padStart(2, '0')} ${ampm}`;
};

const getCurrentTimeOfDay = (): 'morning' | 'afternoon' | 'evening' | 'night' | 'friday' => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 5 = Friday
  const hours = now.getHours();

  if (dayOfWeek === 5) {
    return 'friday';
  }

  if (hours >= 5 && hours < 12) {
    return 'morning';
  } else if (hours >= 12 && hours < 17) {
    return 'afternoon';
  } else if (hours >= 17 && hours < 20) {
    return 'evening';
  } else {
    return 'night';
  }
};

function App() {
  const [currentZikr, setCurrentZikr] = useState<Zikr>(azkarList[0]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [count, setCount] = useState(0);
  const [hijriDate, setHijriDate] = useState('');
  const [dayName, setDayName] = useState('');
  const [hijriDay, setHijriDay] = useState('');
  const [hijriMonth, setHijriMonth] = useState('');
  const [hijriYear, setHijriYear] = useState('');
  const [gregorianDate, setGregorianDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [particleId, setParticleId] = useState(0);
  const [zikrHistory, setZikrHistory] = useState<Zikr[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [layout, setLayout] = useState<number>(() => {
    const saved = localStorage.getItem('zikrLayout');
    return saved ? parseInt(saved) : 2;
  });
  const [fontSize, setFontSize] = useState<number>(() => {
    const saved = localStorage.getItem('zikrFontSize');
    return saved ? parseInt(saved) : 48;
  });
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [startY, setStartY] = useState(0);
  const [horizontalSwipe, setHorizontalSwipe] = useState(0);
  const [isSwipingHorizontal, setIsSwipingHorizontal] = useState(false);
  const [startX, setStartX] = useState(0);
  const [swipeFromRightEdge, setSwipeFromRightEdge] = useState(false);
  const [currentPage, setCurrentPage] = useState('main');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerFilter, setDrawerFilter] = useState<'all' | 'morning' | 'evening'>('all');
  const [readAzkar, setReadAzkar] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('readAzkar');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  useEffect(() => {
    // Save layout to localStorage
    localStorage.setItem('zikrLayout', layout.toString());
  }, [layout]);

  useEffect(() => {
    // Save font size to localStorage
    localStorage.setItem('zikrFontSize', fontSize.toString());
  }, [fontSize]);

  useEffect(() => {
    // Get Hijri date using API for accuracy
    const fetchHijriDate = async () => {
      try {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');

        // Get day name in Arabic
        const dayNames = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
        const dayName = dayNames[today.getDay()];

        // Using Aladhan API for accurate Hijri date
        const response = await fetch(`https://api.aladhan.com/v1/gToH/${day}-${month}-${year}`);
        const data = await response.json();

        if (data.code === 200 && data.data) {
          const hijri = data.data.hijri;
          const monthNames = [
            'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني',
            'جمادى الأولى', 'جمادى الثانية', 'رجب', 'شعبان',
            'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
          ];
          const monthName = monthNames[parseInt(hijri.month.number) - 1] || hijri.month.ar;
          setHijriDate(`${dayName} ${hijri.day} ${monthName} ${hijri.year} هـ`);
          setDayName(dayName);
          setHijriDay(hijri.day);
          setHijriMonth(monthName);
          setHijriYear(`${hijri.year} هـ`);
        } else {
          // Fallback to calculated date if API fails
          const fallbackDate = getHijriDate();
          setHijriDate(`${dayName} ${fallbackDate}`);
          setDayName(dayName);
          // Parse fallback date (format: "DD MonthName YYYY هـ")
          const parts = fallbackDate.split(' ');
          if (parts.length >= 3) {
            setHijriDay(parts[0]);
            setHijriMonth(parts.slice(1, -1).join(' '));
            setHijriYear(parts[parts.length - 1]);
          }
        }

        // Set Gregorian date
        const gregorianMonths = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 
                                  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
        const gregorianMonth = gregorianMonths[today.getMonth()];
        setGregorianDate(`${day} ${gregorianMonth} ${year}`);
      } catch (error) {
        // Fallback to calculated date if API fails
        const today = new Date();
        const dayNames = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
        const dayName = dayNames[today.getDay()];
        const fallbackDate = getHijriDate();
        setHijriDate(`${dayName} ${fallbackDate}`);
        setDayName(dayName);
        // Parse fallback date
        const parts = fallbackDate.split(' ');
        if (parts.length >= 3) {
          setHijriDay(parts[0]);
          setHijriMonth(parts.slice(1, -1).join(' '));
          setHijriYear(parts[parts.length - 1]);
        }
        // Set Gregorian date
        const gregorianMonths = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 
                                  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
        const gregorianMonth = gregorianMonths[today.getMonth()];
        const year = today.getFullYear();
        const day = String(today.getDate()).padStart(2, '0');
        setGregorianDate(`${day} ${gregorianMonth} ${year}`);
      }
    };

    fetchHijriDate();
    setCurrentTime(getCurrentTime());
    const timeInterval = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 1000);

    // Select time-appropriate dhikr
    const timeOfDay = getCurrentTimeOfDay();
    const preferredZikr = azkarList.find(zikr => zikr.preferredTime === timeOfDay) || 
                          azkarList.find(zikr => zikr.preferredTime === 'any') || 
                          azkarList[0];
    setCurrentZikr(preferredZikr);

    return () => clearInterval(timeInterval);
  }, []);

  const getRandomZikr = () => {
    setIsAnimating(true);
    setCount(0);
    setShowCelebration(false);
    setParticles([]);

    // Save current zikr to history
    if (currentZikr) {
      setZikrHistory(prev => [...prev, currentZikr]);
    }

    setTimeout(() => {
      const timeOfDay = getCurrentTimeOfDay();
      // Prefer time-appropriate dhikr, but allow random selection
      const timeAppropriate = azkarList.filter(zikr => 
        zikr.preferredTime === timeOfDay || zikr.preferredTime === 'any'
      );
      const availableZikr = timeAppropriate.length > 0 ? timeAppropriate : azkarList;
      
      let newZikr;
      do {
        newZikr = availableZikr[Math.floor(Math.random() * availableZikr.length)];
      } while (newZikr === currentZikr && availableZikr.length > 1);

      setCurrentZikr(newZikr);
      setIsAnimating(false);
    }, 200);
  };

  const getPreviousZikr = () => {
    if (zikrHistory.length === 0) return;
    
    setIsAnimating(true);
    setCount(0);
    setShowCelebration(false);
    setParticles([]);

    setTimeout(() => {
      const previousZikr = zikrHistory[zikrHistory.length - 1];
      setZikrHistory(prev => prev.slice(0, -1));
      setCurrentZikr(previousZikr);
      setIsAnimating(false);
    }, 200);
  };

  const vibrate = (pattern: number | number[] = 50) => {
    // Check if vibration API is supported
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  const selectZikrFromDrawer = (zikr: Zikr) => {
    // Vibrate on selection
    vibrate([50, 30, 50]);
    
    setIsAnimating(true);
    setCount(0);
    setShowCelebration(false);
    setParticles([]);

    // Save current zikr to history if different
    if (currentZikr && currentZikr.arabic !== zikr.arabic) {
      setZikrHistory(prev => [...prev, currentZikr]);
    }

    setTimeout(() => {
      setCurrentZikr(zikr);
      setIsAnimating(false);
      setIsDrawerOpen(false);
      setCurrentPage('main');
      setDrawerFilter('all');
    }, 200);
  };

  const openDrawerWithFilter = (filter: 'morning' | 'evening') => {
    setDrawerFilter(filter);
    setIsDrawerOpen(true);
  };

  const getTargetCount = (currentCount: number): number | null => {
    if (currentCount < 10) {
      return 10;
    } else if (currentCount < 100) {
      return 100;
    } else {
      return null; // Unlimited
    }
  };

  const handleZikrClick = () => {
    // Vibrate on each click
    vibrate(30);
    
    const newCount = count + 1;
    setCount(newCount);

    // Celebration at milestones: 10, 100, and every 50 after 100 (150, 200, 250, etc.)
    if (newCount === 10 || newCount === 100 || (newCount > 100 && newCount % 50 === 0)) {
      setShowCelebration(true);
      triggerCelebration();
      // Longer vibration for milestones
      vibrate([50, 30, 50, 30, 50]);
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

  const targetCount = getTargetCount(count);

  // Color scheme based on layout
  const colors = layout === 1 ? {
    background: '#F9F8F6',
    header: '#EFE9E3',
    card: '#D9CFC7',
    accent: '#C9B59C',
    text: '#5A4A42',
    textLight: '#8B7A6F'
  } : {
    background: '#3B1E54',
    header: '#9B7EBD',
    card: '#EEEEEE',
    accent: '#D4BEE4',
    text: '#3B1E54',
    textLight: '#9B7EBD'
  };

  return (
    <div
      className="min-h-screen flex flex-col overflow-hidden"
      style={{ backgroundColor: colors.background }}
      onTouchStart={(e) => {
        const clientX = e.touches[0].clientX;
        const clientY = e.touches[0].clientY;
        const screenWidth = window.innerWidth;

        // Check if touch starts from right edge (within 50px from right edge)
        const isFromRightEdge = clientX > screenWidth - 50;
        setSwipeFromRightEdge(isFromRightEdge);

        if (clientY > window.innerHeight * 0.7) {
          setStartY(clientY);
          setIsPulling(true);
        }
        setStartX(clientX);
        setIsSwipingHorizontal(false);
      }}
      onTouchMove={(e) => {
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;

        if (isPulling && startY > 0) {
          const distance = Math.max(0, currentY - startY);
          if (distance > 0 && distance < 150) {
            setPullDistance(distance);
          }
        }

        if (Math.abs(currentX - startX) > 10 && !isPulling) {
          setIsSwipingHorizontal(true);
          const swipeDistance = currentX - startX;
          if (Math.abs(swipeDistance) < 150) {
            setHorizontalSwipe(swipeDistance);
          }
        }
      }}
      onTouchEnd={() => {
        if (pullDistance > 80) {
          getRandomZikr();
        }
        setPullDistance(0);
        setIsPulling(false);
        setStartY(0);

        // Handle drawer opening from right edge swipe
        if (swipeFromRightEdge && horizontalSwipe < -50) {
          // Swipe from right edge to left (opening drawer)
          if (!isDrawerOpen) {
            setIsDrawerOpen(true);
            setDrawerFilter('all');
          }
        } else if (isDrawerOpen && horizontalSwipe > 50) {
          // Swipe right to close drawer
          setIsDrawerOpen(false);
          setDrawerFilter('all');
        } else if (!isDrawerOpen && horizontalSwipe < -80) {
          // Swipe left to go to history (only if drawer is closed)
          setCurrentPage('history');
        } else if (horizontalSwipe > 80 && !swipeFromRightEdge) {
          // Swipe right from anywhere else goes to main
          setCurrentPage('main');
        }

        setHorizontalSwipe(0);
        setIsSwipingHorizontal(false);
        setStartX(0);
        setSwipeFromRightEdge(false);
      }}
    >
      <style>{`
        .container input {
          position: absolute;
          opacity: 0;
          cursor: pointer;
          height: 0;
          width: 0;
        }

        .container {
          display: block;
          position: relative;
          cursor: pointer;
          font-size: 25px;
          user-select: none;
        }

        .checkmark {
          position: relative;
          top: 0;
          left: 0;
          height: 1.3em;
          width: 1.3em;
          background: ${colors.text};
          border-radius: 50px;
          transition: all 0.7s;
          --spread: 20px;
          flex-shrink: 0;
        }

        .container input:checked ~ .checkmark {
          background: ${colors.text};
          box-shadow: -10px -10px var(--spread) 0px ${colors.accent}, 
                      0 -10px var(--spread) 0px ${colors.accent}, 
                      10px -10px var(--spread) 0px ${colors.accent}, 
                      10px 0 var(--spread) 0px ${colors.accent}, 
                      10px 10px var(--spread) 0px ${colors.accent}, 
                      0 10px var(--spread) 0px ${colors.accent}, 
                      -10px 10px var(--spread) 0px ${colors.accent};
        }

        .checkmark:after {
          content: "";
          position: absolute;
          display: none;
        }

        .container input:checked ~ .checkmark:after {
          display: block;
        }

        .container .checkmark:after {
          left: 0.45em;
          top: 0.25em;
          width: 0.25em;
          height: 0.5em;
          border: solid ${colors.card};
          border-width: 0 0.15em 0.15em 0;
          transform: rotate(45deg);
        }

        .container input {
          position: absolute;
          opacity: 0;
          cursor: pointer;
          height: 0;
          width: 0;
        }

        .container {
          display: block;
          position: relative;
          cursor: pointer;
          font-size: 25px;
          user-select: none;
        }

        .checkmark {
          position: relative;
          top: 0;
          left: 0;
          height: 1.3em;
          width: 1.3em;
          background: ${colors.text};
          border-radius: 50px;
          transition: all 0.7s;
          --spread: 20px;
          flex-shrink: 0;
        }

        .container input:checked ~ .checkmark {
          background: ${colors.text};
          box-shadow: -10px -10px var(--spread) 0px ${colors.accent}, 
                      0 -10px var(--spread) 0px ${colors.accent}, 
                      10px -10px var(--spread) 0px ${colors.accent}, 
                      10px 0 var(--spread) 0px ${colors.accent}, 
                      10px 10px var(--spread) 0px ${colors.accent}, 
                      0 10px var(--spread) 0px ${colors.accent}, 
                      -10px 10px var(--spread) 0px ${colors.accent};
        }

        .checkmark:after {
          content: "";
          position: absolute;
          display: none;
        }

        .container input:checked ~ .checkmark:after {
          display: block;
        }

        .container .checkmark:after {
          left: 0.45em;
          top: 0.25em;
          width: 0.25em;
          height: 0.5em;
          border: solid ${colors.card};
          border-width: 0 0.15em 0.15em 0;
          transform: rotate(45deg);
        }

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

      <div className="py-4 px-6" style={{ backgroundColor: colors.header }}>
        <div className="flex justify-between items-center">
          <div className="flex items-baseline gap-2 flex-wrap">
            {dayName && (
              <span className="font-bold text-3xl" style={{ color: colors.text }}>{dayName}</span>
            )}
            <span className="font-bold text-3xl" style={{ color: colors.text }}>{hijriDay}</span>
            <span className="font-bold text-3xl" style={{ color: colors.text }}>{hijriMonth}</span>
            <span className="font-bold text-3xl" style={{ color: colors.text }}>{hijriYear}</span>
            {gregorianDate && (
              <>
                <span className="font-semibold text-xl mx-2" style={{ color: colors.textLight }}>|</span>
                <span className="font-semibold text-lg" style={{ color: colors.textLight }}>{gregorianDate}</span>
              </>
            )}
          </div>
          <p className="font-bold text-2xl" style={{ color: colors.text }}>{currentTime}</p>
        </div>
      </div>

      <div className="px-6 py-2 flex justify-between items-center gap-2">
        <button
          onClick={() => {
            setIsDrawerOpen(!isDrawerOpen);
            if (!isDrawerOpen) {
              setDrawerFilter('all');
            }
          }}
          className="p-2 rounded-lg transition-all duration-300 hover:opacity-80 active:scale-95"
          style={{ 
            backgroundColor: colors.accent,
            color: colors.text
          }}
          title="فهرس الأذكار"
        >
          <Menu className="w-5 h-5" />
        </button>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 rounded-lg transition-all duration-300 hover:opacity-80 active:scale-95"
          style={{ 
            backgroundColor: colors.accent,
            color: colors.text
          }}
          title="الإعدادات"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Overlay backdrop for Drawer */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity duration-300"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Drawer for Zikr Index */}
      <div
        className={`fixed inset-y-0 right-0 w-full max-w-md z-50 transition-transform duration-300 ease-in-out ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          backgroundColor: colors.background,
          boxShadow: isDrawerOpen ? '-4px 0 20px rgba(0, 0, 0, 0.3)' : 'none'
        }}
      >
        
        <div className="h-full flex flex-col overflow-hidden">
          {/* Drawer Header */}
          <div
            className="p-4 border-b flex items-center justify-between"
            style={{
              backgroundColor: colors.header,
              borderColor: colors.accent
            }}
          >
            <h2
              className="text-2xl font-bold"
              style={{ color: colors.text }}
            >
              {drawerFilter === 'morning' ? 'أذكار الصباح' : drawerFilter === 'evening' ? 'أذكار المساء' : 'فهرس الأذكار'}
            </h2>
            <button
              onClick={() => {
                setIsDrawerOpen(false);
                setDrawerFilter('all');
              }}
              className="p-2 rounded-lg transition-all duration-300 hover:opacity-80 active:scale-95"
              style={{
                backgroundColor: colors.accent,
                color: colors.text
              }}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Drawer Content - Scrollable List */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-3">
              {(() => {
                // Combine morning/evening azkar with regular azkar based on filter
                let filteredZikr: Zikr[] = [];
                
                if (drawerFilter === 'morning') {
                  // Add morning-specific azkar
                  const morningAzkar = morningEveningAzkar.filter(azkar => azkar.time === 'morning');
                  // Add regular azkar that are preferred for morning or any time
                  const morningPreferred = azkarList.filter(zikr => 
                    zikr.preferredTime === 'morning' || zikr.preferredTime === 'any'
                  );
                  filteredZikr = [
                    ...morningAzkar.map(a => ({
                      arabic: a.arabic,
                      transliteration: a.transliteration,
                      translation: a.translation,
                      preferredTime: 'morning' as const
                    })),
                    ...morningPreferred
                  ];
                } else if (drawerFilter === 'evening') {
                  // Add evening-specific azkar
                  const eveningAzkar = morningEveningAzkar.filter(azkar => azkar.time === 'evening');
                  // Add regular azkar that are preferred for evening or any time
                  const eveningPreferred = azkarList.filter(zikr => 
                    zikr.preferredTime === 'evening' || zikr.preferredTime === 'any'
                  );
                  filteredZikr = [
                    ...eveningAzkar.map(a => ({
                      arabic: a.arabic,
                      transliteration: a.transliteration,
                      translation: a.translation,
                      preferredTime: 'evening' as const
                    })),
                    ...eveningPreferred
                  ];
                } else {
                  // Show all azkar
                  filteredZikr = azkarList;
                }
                
                return filteredZikr.map((zikr, index) => (
                <div
                  key={index}
                  onClick={() => selectZikrFromDrawer(zikr)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 active:scale-95 ${
                    currentZikr.arabic === zikr.arabic ? 'ring-2' : ''
                  }`}
                  style={{
                    backgroundColor: currentZikr.arabic === zikr.arabic ? colors.accent : colors.card,
                    borderRight: `4px solid ${currentZikr.arabic === zikr.arabic ? colors.text : colors.accent}`,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <p
                    className="font-semibold mb-2 text-lg"
                    style={{
                      color: colors.text,
                      fontFamily: "'Cairo', 'Segoe UI', sans-serif"
                    }}
                  >
                    {zikr.arabic}
                  </p>
                  <p
                    className="text-sm italic mb-1"
                    style={{ color: colors.textLight }}
                  >
                    {zikr.transliteration}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: colors.textLight }}
                  >
                    {zikr.translation}
                  </p>
                  {zikr.preferredTime && (
                    <div className="mt-2">
                      <span
                        className="text-xs px-2 py-1 rounded-full"
                        style={{
                          backgroundColor: colors.accent,
                          color: colors.text,
                          opacity: 0.8
                        }}
                      >
                        {zikr.preferredTime === 'friday' && 'يوم الجمعة'}
                        {zikr.preferredTime === 'morning' && 'الصباح'}
                        {zikr.preferredTime === 'afternoon' && 'الظهر'}
                        {zikr.preferredTime === 'evening' && 'المساء'}
                        {zikr.preferredTime === 'night' && 'الليل'}
                        {zikr.preferredTime === 'any' && 'أي وقت'}
                      </span>
                    </div>
                  )}
                </div>
              ));
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowSettings(false)}
        >
          <style>{`
            .settings-card {
              --white: ${layout === 1 ? 'hsl(0, 0%, 100%)' : 'hsl(0, 0%, 100%)'};
              --black: ${layout === 1 ? 'hsl(30, 15%, 20%)' : 'hsl(240, 15%, 9%)'};
              --paragraph: ${layout === 1 ? 'hsl(30, 10%, 70%)' : 'hsl(0, 0%, 83%)'};
              --line: ${layout === 1 ? 'hsl(30, 15%, 40%)' : 'hsl(240, 9%, 17%)'};
              --primary: ${layout === 1 ? 'hsl(30, 50%, 60%)' : 'hsl(266, 92%, 58%)'};
              --gradient-1: ${layout === 1 ? 'hsla(30, 40%, 50%, 1)' : 'hsla(263, 93%, 56%, 1)'};
              --gradient-2: ${layout === 1 ? 'hsla(30, 50%, 70%, 1)' : 'hsla(284, 100%, 84%, 1)'};
              --gradient-3: ${layout === 1 ? 'hsla(30, 45%, 60%, 1)' : 'hsla(306, 100%, 57%, 1)'};
              --button-gradient-1: ${layout === 1 ? 'rgba(201, 181, 156, 1)' : 'rgba(94, 58, 238, 1)'};
              --button-gradient-2: ${layout === 1 ? 'rgba(217, 207, 199, 1)' : 'rgba(197, 107, 240, 1)'};
              --border-gradient-1: ${layout === 1 ? 'hsl(30, 30%, 80%)' : 'hsl(0, 0%, 100%)'};
              --border-gradient-2: ${layout === 1 ? 'hsl(30, 20%, 50%)' : 'hsl(0, 0%, 40%)'};
              --border-rotate: ${layout === 1 ? 'hsl(30, 50%, 60%)' : 'hsl(277, 95%, 60%)'};

              position: relative;
              display: flex;
              flex-direction: column;
              gap: 1rem;
              padding: 1rem;
              width: 19rem;
              max-width: 90vw;
              background-color: ${layout === 1 ? 'hsla(30, 15%, 20%, 1)' : 'hsla(240, 15%, 9%, 1)'};
              background-image: radial-gradient(
                  at 88% 40%,
                  ${layout === 1 ? 'hsla(30, 15%, 20%, 1)' : 'hsla(240, 15%, 9%, 1)'} 0px,
                  transparent 85%
                ),
                radial-gradient(at 49% 30%, ${layout === 1 ? 'hsla(30, 15%, 20%, 1)' : 'hsla(240, 15%, 9%, 1)'} 0px, transparent 85%),
                radial-gradient(at 14% 26%, ${layout === 1 ? 'hsla(30, 15%, 20%, 1)' : 'hsla(240, 15%, 9%, 1)'} 0px, transparent 85%),
                radial-gradient(at 0% 64%, var(--gradient-1) 0px, transparent 85%),
                radial-gradient(at 41% 94%, var(--gradient-2) 0px, transparent 85%),
                radial-gradient(at 100% 99%, var(--gradient-3) 0px, transparent 85%);
              border-radius: 1rem;
              box-shadow: 0px -16px 24px 0px rgba(255, 255, 255, 0.25) inset;
            }

            .settings-card .card__border {
              overflow: hidden;
              pointer-events: none;
              position: absolute;
              z-index: -10;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: calc(100% + 2px);
              height: calc(100% + 2px);
              background-image: linear-gradient(
                0deg,
                var(--border-gradient-1) -50%,
                var(--border-gradient-2) 100%
              );
              border-radius: 1rem;
            }

            .settings-card .card__border::before {
              content: "";
              pointer-events: none;
              position: fixed;
              z-index: 200;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(0deg);
              transform-origin: left;
              width: 200%;
              height: 10rem;
              background-image: linear-gradient(
                0deg,
                hsla(0, 0%, 100%, 0) 0%,
                var(--border-rotate) 40%,
                var(--border-rotate) 60%,
                hsla(0, 0%, 40%, 0) 100%
              );
              animation: rotate 8s linear infinite;
            }

            @keyframes rotate {
              to {
                transform: translate(-50%, -50%) rotate(360deg);
              }
            }

            .settings-card .card_title__container .card_title {
              font-size: 1rem;
              color: var(--white);
            }

            .settings-card .card_title__container .card_paragraph {
              margin-top: 0.25rem;
              width: 65%;
              font-size: 0.5rem;
              color: var(--paragraph);
            }

            .settings-card .line {
              width: 100%;
              height: 0.1rem;
              background-color: var(--line);
              border: none;
            }

            .settings-card .card__list {
              display: flex;
              flex-direction: column;
              gap: 0.5rem;
            }

            .settings-card .card__list .card__list_item {
              display: flex;
              align-items: center;
              gap: 0.5rem;
              cursor: pointer;
            }

            .settings-card .card__list .card__list_item .check {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 1rem;
              height: 1rem;
              background-color: var(--primary);
              border-radius: 50%;
            }

            .settings-card .card__list .card__list_item .check .check_svg {
              width: 0.75rem;
              height: 0.75rem;
              fill: var(--black);
            }

            .settings-card .card__list .card__list_item .list_text {
              font-size: 0.75rem;
              color: var(--white);
            }

            .settings-card .button {
              cursor: pointer;
              padding: 0.5rem;
              width: 100%;
              background-image: linear-gradient(
                0deg,
                var(--button-gradient-1) 0%,
                var(--button-gradient-2) 100%
              );
              font-size: 0.75rem;
              color: var(--white);
              border: 0;
              border-radius: 9999px;
              box-shadow: inset 0 -2px 25px -4px var(--white);
            }

            .settings-card .toggle-label {
              display: inline-flex;
              align-items: center;
              cursor: pointer;
              color: var(--white);
              width: 100%;
              justify-content: space-between;
            }

            .settings-card .toggle-label-text {
              margin-left: 16px;
              font-size: 0.75rem;
              color: var(--white);
            }

            .settings-card .toggle {
              isolation: isolate;
              position: relative;
              height: 30px;
              width: 60px;
              border-radius: 15px;
              overflow: hidden;
              box-shadow: -8px -4px 8px 0px rgba(255, 255, 255, 0.1),
                8px 4px 12px 0px rgba(0, 0, 0, 0.3),
                4px 4px 4px 0px rgba(0, 0, 0, 0.2) inset,
                -4px -4px 4px 0px rgba(255, 255, 255, 0.1) inset;
            }

            .settings-card .toggle-state {
              display: none;
            }

            .settings-card .toggle-indicator {
              height: 100%;
              width: 200%;
              background: var(--primary);
              border-radius: 15px;
              transform: translate3d(-75%, 0, 0);
              transition: transform 0.4s cubic-bezier(0.85, 0.05, 0.18, 1.35);
              box-shadow: -8px -4px 8px 0px rgba(255, 255, 255, 0.1),
                8px 4px 12px 0px rgba(0, 0, 0, 0.3);
            }

            .settings-card .toggle-state:checked ~ .toggle-indicator {
              transform: translate3d(25%, 0, 0);
            }
          `}</style>
          <div 
            className="settings-card mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="card__border"></div>
            
            <div className="card_title__container flex justify-between items-center">
              <div>
                <h2 className="card_title">الإعدادات</h2>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="p-1 rounded-lg hover:opacity-80 transition-all"
                style={{ color: 'var(--white)' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <hr className="line" />

            <div>
              <div className="card_title__container mb-3">
                <h3 className="card_title" style={{ fontSize: '0.875rem' }}>اختيار الشكل</h3>
              </div>
              <label className="toggle-label">
                <span className="toggle-label-text">
                  {layout === 1 ? 'الشكل 1' : 'الشكل 2'}
                </span>
                <div className="toggle">
                  <input
                    type="checkbox"
                    className="toggle-state"
                    checked={layout === 2}
                    onChange={() => setLayout(layout === 1 ? 2 : 1)}
                  />
                  <div className="toggle-indicator"></div>
                </div>
              </label>
            </div>

            <hr className="line" />

            <div>
              <div className="card_title__container mb-3">
                <h3 className="card_title" style={{ fontSize: '0.875rem' }}>حجم الخط</h3>
              </div>
              <div className="flex items-center gap-3">
                <span style={{ color: 'var(--white)', fontSize: '0.75rem' }}>صغير</span>
                <input
                  type="range"
                  min="32"
                  max="64"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  style={{
                    flex: 1,
                    accentColor: 'var(--primary)',
                    cursor: 'pointer'
                  }}
                />
                <span style={{ color: 'var(--white)', fontSize: '0.75rem' }}>كبير</span>
              </div>
              <div style={{ color: 'var(--paragraph)', fontSize: '0.65rem', marginTop: '0.5rem', textAlign: 'center' }}>
                {fontSize}px
              </div>
            </div>
          </div>
        </div>
      )}

      {pullDistance > 0 && (
        <div
          className="fixed bottom-0 left-0 right-0 flex items-center justify-center z-40 transition-all duration-200 pointer-events-none p-4"
          style={{
            transform: `translateY(${Math.min(pullDistance, 100)}px)`,
            opacity: Math.min(pullDistance / 80, 1)
          }}
        >
          <div
            className="rounded-2xl p-4 max-w-sm w-full"
            style={{
              backgroundColor: colors.accent,
              color: colors.text,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
            }}
          >
            <p className="text-xs font-semibold mb-2">السبب: {currentZikr.reason}</p>
            <p className="text-xs">الفائدة: {currentZikr.benefit}</p>
          </div>
        </div>
      )}

      <div
        className="flex-1 flex items-center justify-center p-4 overflow-auto relative transition-transform duration-300"
        style={{
          transform: `translateX(${isDrawerOpen ? horizontalSwipe * 0.3 : horizontalSwipe * 0.5}px)`,
        }}
      >
        {currentPage === 'main' && (
        <div className="w-full max-w-2xl space-y-4">
          {/* Morning/Evening Azkar Box */}
          {(() => {
            const now = new Date();
            const hours = now.getHours();
            const isMorning = hours >= 5 && hours < 15;
            const isEvening = hours >= 15 || hours < 5;

            if (!isMorning && !isEvening) {
              return null;
            }

            const timeOfDay = isMorning ? 'morning' : 'evening';
            const boxId = timeOfDay === 'morning' ? 'morning-azkar' : 'evening-azkar';
            const boxTitle = timeOfDay === 'morning' ? 'أذكار الصباح' : 'أذكار المساء';

            return (
              <div
                className="rounded-3xl shadow-2xl p-6 cursor-pointer"
                style={{
                  backgroundColor: colors.card,
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
                }}
                onClick={() => openDrawerWithFilter(timeOfDay)}
              >
                <label className="container flex items-center gap-4 cursor-pointer" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={readAzkar.has(boxId)}
                    onChange={(e) => {
                      const newReadAzkar = new Set(readAzkar);
                      if (e.target.checked) {
                        newReadAzkar.add(boxId);
                      } else {
                        newReadAzkar.delete(boxId);
                      }
                      setReadAzkar(newReadAzkar);
                      localStorage.setItem('readAzkar', JSON.stringify([...newReadAzkar]));
                    }}
                  />
                  <span className="checkmark"></span>
                </label>
                <h3 
                  className="text-2xl font-bold flex-1 cursor-pointer" 
                  style={{ color: colors.text }}
                  onClick={() => openDrawerWithFilter(timeOfDay)}
                >
                  {boxTitle}
                </h3>
              </div>
            );
          })()}

          {/* Main Zikr Box */}
          <div
            onClick={handleZikrClick}
            className={`rounded-3xl shadow-2xl p-8 min-h-[400px] flex flex-col justify-center transition-all duration-300 cursor-pointer active:scale-98 relative ${
              showCelebration ? 'scale-105 ring-4' : ''
            }`}
            style={{
              backgroundColor: colors.card,
              boxShadow: showCelebration ? `0 0 0 4px ${colors.accent}` : '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
              transform: pullDistance > 0 ? `translateY(${Math.min(pullDistance * 0.5, 50)}px)` : 'translateY(0)'
            }}
          >
            {/* Counter inside the box - smaller and positioned */}
            <div className="absolute top-4 right-4">
              <div className="flex items-center gap-2">
                <p
                  className={`font-bold transition-all duration-300 text-lg ${showCelebration ? 'scale-125' : ''}`}
                  style={{ color: showCelebration ? colors.accent : colors.textLight }}
                >
                  {count}
                </p>
                {targetCount !== null && (
                  <p className="text-xs" style={{ color: colors.textLight }}>/ {targetCount}</p>
                )}
                {targetCount === null && count >= 100 && (
                  <p className="text-xs" style={{ color: colors.textLight }}>∞</p>
                )}
              </div>
            </div>

            <div className={`transition-opacity duration-200 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
              <div className="text-center mb-6">
                <p
                  className="leading-relaxed font-semibold mb-6"
                  style={{
                    color: colors.text,
                    fontFamily: "'Cairo', 'Segoe UI', sans-serif",
                    lineHeight: '1.8',
                    fontSize: `${fontSize}px`,
                    transition: 'font-size 0.3s ease'
                  }}
                >
                  {currentZikr.arabic}
                </p>
              </div>

              <div className="space-y-3 text-center">
                <p
                  className="text-lg italic"
                  style={{ color: colors.textLight }}
                >
                  {currentZikr.transliteration}
                </p>
                <p
                  className="text-base"
                  style={{ color: colors.textLight }}
                >
                  {currentZikr.translation}
                </p>
                {currentZikr.preferredTime && (
                  <p
                    className="text-xs mt-2"
                    style={{ color: colors.accent }}
                  >
                    {currentZikr.preferredTime === 'friday' && 'أفضل في يوم الجمعة'}
                    {currentZikr.preferredTime === 'morning' && 'أفضل في الصباح'}
                    {currentZikr.preferredTime === 'afternoon' && 'أفضل في الظهر'}
                    {currentZikr.preferredTime === 'evening' && 'أفضل في المساء'}
                    {currentZikr.preferredTime === 'night' && 'أفضل في الليل'}
                  </p>
                )}
              </div>
            </div>

            {showCelebration && (
              <div
                className="text-center mt-4 text-lg font-bold animate-bounce"
                style={{ color: colors.accent }}
              >
                ما شاء الله! 🎉
              </div>
            )}
          </div>
        </div>
        )}

        {currentPage === 'history' && (
        <div className="w-full max-w-2xl">
          <div
            className="rounded-3xl shadow-2xl p-8"
            style={{
              backgroundColor: colors.card,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
            }}
          >
            <h2 className="text-3xl font-bold mb-6" style={{ color: colors.text }}>
              سجل الأذكار
            </h2>

            {zikrHistory.length === 0 ? (
              <p className="text-center py-8" style={{ color: colors.textLight }}>
                لم تقرأ أي أذكار حتى الآن
              </p>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {[...zikrHistory].reverse().map((zikr, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-2xl"
                    style={{
                      backgroundColor: colors.background,
                      borderRight: `4px solid ${colors.accent}`
                    }}
                  >
                    <p
                      className="font-semibold mb-2"
                      style={{
                        color: colors.text,
                        fontSize: '18px',
                        fontFamily: "'Cairo', 'Segoe UI', sans-serif"
                      }}
                    >
                      {zikr.arabic}
                    </p>
                    <p className="text-sm italic" style={{ color: colors.textLight }}>
                      {zikr.transliteration}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 pt-6 border-t" style={{ borderColor: colors.accent }}>
              <p style={{ color: colors.textLight }} className="text-sm">
                إجمالي الأذكار المقروءة: {zikrHistory.length}
              </p>
            </div>
          </div>
        </div>
        )}
      </div>

      <div className="p-4" style={{ backgroundColor: colors.header }}>
        <div className="flex gap-3">
          <button
            onClick={getPreviousZikr}
            disabled={zikrHistory.length === 0}
            className="font-semibold py-4 px-6 rounded-2xl shadow-lg transition-all duration-300 flex items-center justify-center gap-3 active:scale-95 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              backgroundColor: zikrHistory.length === 0 ? colors.header : colors.accent,
              color: colors.text,
              border: zikrHistory.length === 0 ? `2px solid ${colors.accent}` : 'none',
              flex: '1'
            }}
          >
            <ChevronLeft className="w-5 h-5" />
            الذكر السابق
          </button>
          <button
            onClick={getRandomZikr}
            className="font-semibold py-4 px-6 rounded-2xl shadow-lg transition-all duration-300 flex items-center justify-center gap-3 active:scale-95 hover:opacity-90"
            style={{ 
              backgroundColor: colors.accent,
              color: colors.text,
              flex: '3'
            }}
          >
            الذكر التالي
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
