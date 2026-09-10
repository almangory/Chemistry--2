import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Dashboard } from "./components/Dashboard";
import { SyllabusView } from "./components/SyllabusView";
import { VirtualLab } from "./components/VirtualLab";
import { GlossaryView } from "./components/GlossaryView";
import { QuizView } from "./components/QuizView";
import { StudentAssistant } from "./components/StudentAssistant";
import { WorksheetGenerator } from "./components/WorksheetGenerator";
import { StudentProfileModal } from "./components/StudentProfileModal";
import {
  Award,
  BookOpen,
  FlaskConical,
  CheckSquare,
  Sparkles,
  TrendingUp,
  Atom,
  HelpCircle,
  Menu,
  X,
  FileText,
  Moon,
  Sun,
  Wifi,
  WifiOff,
  Maximize2,
  Minimize2,
  GraduationCap,
  SlidersHorizontal
} from "lucide-react";

type TabType = "dashboard" | "syllabus" | "lab" | "glossary" | "quiz" | "worksheets";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [favoriteLessons, setFavoriteLessons] = useState<string[]>([]);
  const [completedLabs, setCompletedLabs] = useState<string[]>([]);
  const [quizScores, setQuizScores] = useState<Record<string, number>>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [selectedExperimentId, setSelectedExperimentId] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [isExitModalOpen, setIsExitModalOpen] = useState<boolean>(false);
  const [isFocusReading, setIsFocusReading] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<any>(() => {
    try {
      const saved = localStorage.getItem("sudan_auth_user") || localStorage.getItem("currentUser") || localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Reset focus reading mode when active tab changes
  useEffect(() => {
    setIsFocusReading(false);
  }, [activeTab]);

  // Sync online/offline status & register service worker
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Register Service Worker for offline capability
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then(
        (reg) => console.log("Service Worker registered on scope:", reg.scope),
        (err) => console.error("Service Worker registration failed:", err)
      );
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Sync window beforeunload browser exit dialog
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "هل أنت متأكد من مغادرة موقع كيمياء الثاني الثانوي؟";
      return "هل أنت متأكد من مغادرة موقع كيمياء الثاني الثانوي؟";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Setup history state for browser/hardware back button navigation
  useEffect(() => {
    interface AppHistoryState {
      activeTab: TabType;
      selectedLessonId: string | null;
      selectedExperimentId: string | null;
      isExitSentinel?: boolean;
    }

    // Push initial exit sentinel state so going back from home screen prompts before leaving
    if (!window.history.state) {
      window.history.replaceState({ isExitSentinel: true }, "", "");
      window.history.pushState(
        { activeTab: "dashboard", selectedLessonId: null, selectedExperimentId: null },
        "",
        "#dashboard"
      );
    }

    const handlePopState = (event: PopStateEvent) => {
      const state = event.state as AppHistoryState | null;
      if (state && state.isExitSentinel) {
        // Trigger exit prompt
        setIsExitModalOpen(true);
        // Retain current position in history stack
        window.history.pushState(
          { activeTab: "dashboard", selectedLessonId: null, selectedExperimentId: null },
          "",
          "#dashboard"
        );
      } else if (state) {
        setActiveTab(state.activeTab);
        setSelectedLessonId(state.selectedLessonId);
        setSelectedExperimentId(state.selectedExperimentId);
      } else {
        setActiveTab("dashboard");
        setSelectedLessonId(null);
        setSelectedExperimentId(null);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Update history state when react navigation states change (excluding exit sentinel or identical states)
  useEffect(() => {
    interface AppHistoryState {
      activeTab: TabType;
      selectedLessonId: string | null;
      selectedExperimentId: string | null;
      isExitSentinel?: boolean;
    }

    const currentState = window.history.state as AppHistoryState | null;
    if (
      !currentState ||
      currentState.isExitSentinel ||
      currentState.activeTab !== activeTab ||
      currentState.selectedLessonId !== selectedLessonId ||
      currentState.selectedExperimentId !== selectedExperimentId
    ) {
      window.history.pushState(
        { activeTab, selectedLessonId, selectedExperimentId },
        "",
        `#${activeTab}`
      );
    }
  }, [activeTab, selectedLessonId, selectedExperimentId]);

  // Sync dark mode on mount
  useEffect(() => {
    try {
      const storedDark = localStorage.getItem("sd_chem_darkmode");
      if (storedDark === "true") {
        setIsDarkMode(true);
        document.documentElement.classList.add("dark");
      } else {
        setIsDarkMode(false);
        document.documentElement.classList.remove("dark");
      }
    } catch (e) {
      console.error("Failed to load dark mode configuration", e);
    }
  }, []);

  const toggleDarkMode = () => {
    const nextVal = !isDarkMode;
    setIsDarkMode(nextVal);
    localStorage.setItem("sd_chem_darkmode", String(nextVal));
    if (nextVal) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Load progress from localStorage on mount
  useEffect(() => {
    try {
      const storedLessons = localStorage.getItem("sd_chem_lessons");
      const storedFavorites = localStorage.getItem("sd_chem_favorites");
      const storedLabs = localStorage.getItem("sd_chem_labs");
      const storedScores = localStorage.getItem("sd_chem_scores");

      if (storedLessons) setCompletedLessons(JSON.parse(storedLessons));
      if (storedFavorites) setFavoriteLessons(JSON.parse(storedFavorites));
      if (storedLabs) setCompletedLabs(JSON.parse(storedLabs));
      if (storedScores) setQuizScores(JSON.parse(storedScores));
    } catch (e) {
      console.error("Failed to load progress from localStorage", e);
    }
  }, []);

  const toggleLessonComplete = (lessonId: string) => {
    const updated = completedLessons.includes(lessonId)
      ? completedLessons.filter((id) => id !== lessonId)
      : [...completedLessons, lessonId];
    
    setCompletedLessons(updated);
    localStorage.setItem("sd_chem_lessons", JSON.stringify(updated));
  };

  const toggleLessonFavorite = (lessonId: string) => {
    const updated = favoriteLessons.includes(lessonId)
      ? favoriteLessons.filter((id) => id !== lessonId)
      : [...favoriteLessons, lessonId];
    
    setFavoriteLessons(updated);
    localStorage.setItem("sd_chem_favorites", JSON.stringify(updated));
  };

  const handleSaveScore = (unitId: string, score: number) => {
    const updated = { ...quizScores, [unitId]: score };
    setQuizScores(updated);
    localStorage.setItem("sd_chem_scores", JSON.stringify(updated));

    // Also mark corresponding lab as completed if appropriate
    const labId = `lab_${unitId}`;
    if (!completedLabs.includes(labId)) {
      const updatedLabs = [...completedLabs, labId];
      setCompletedLabs(updatedLabs);
      localStorage.setItem("sd_chem_labs", JSON.stringify(updatedLabs));
    }
  };

  const handleLabComplete = (labId: string) => {
    if (!completedLabs.includes(labId)) {
      const updated = [...completedLabs, labId];
      setCompletedLabs(updated);
      localStorage.setItem("sd_chem_labs", JSON.stringify(updated));
    }
  };

  const menuItems = [
    { id: "dashboard", label: "الرئيسة ولوحة الوحدات", icon: Award },
    { id: "syllabus", label: "قسم المنهج والدروس", icon: BookOpen },
    { id: "lab", label: "المعمل الكيميائي (21 تجربة)", icon: FlaskConical },
    { id: "worksheets", label: "توليد أوراق العمل والطباعة", icon: FileText },
    { id: "glossary", label: "المصطلحات والمفاهيم", icon: Atom },
    { id: "quiz", label: "الامتحانات والتقييم", icon: CheckSquare }
  ];

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1A1A1A] flex flex-col font-sans antialiased overflow-x-hidden" dir="rtl">
      {/* 🇸🇩 شريط السيو والروابط العكسية المعتمد لمنصة المناهج السودانية التفاعلية (Naqla SEO Bar) */}
      <div style={{ background: "linear-gradient(90deg, #064E3B, #047857)", color: "#ffffff", padding: "7px 16px", fontSize: "12.5px", fontFamily: "system-ui, -apple-system, sans-serif", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.15)", boxShadow: "0 2px 8px rgba(0,0,0,0.15)", zIndex: 60 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700 }}>
          <span>🇸🇩</span>
          <span>ضمن منظومة المناهج السودانية التفاعلية | منصة نقلة التعليمية</span>
        </div>
        <a href="https://sudan-interactive-curricula.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ color: "#6ee7b7", fontWeight: 800, textDecoration: "none", fontSize: "11.5px", display: "flex", alignItems: "center", gap: "4px", transition: "color 0.2s" }}>
          <span>العودة للمنصة الرئيسية</span>
          <span>↗</span>
        </a>
      </div>

      {/* Mobile Top Navbar */}
      <header className={`${isFocusReading ? "hidden" : "lg:hidden flex"} bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-[#E5E2DE] dark:border-slate-800 sticky top-0 z-40 px-4 py-3 justify-between items-center`}>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg bg-[#F9F8F6] dark:bg-slate-800 border border-[#E5E2DE] dark:border-slate-700 text-[#2C3E50] dark:text-slate-200 focus:outline-none"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="مؤشراتي وملف الطالب"
          >
            <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">{currentUser?.username || "مؤشراتي"}</span>
          </button>

          <button
            onClick={toggleDarkMode}
            className="p-1.5 rounded-lg bg-[#F9F8F6] dark:bg-slate-800 border border-[#E5E2DE] dark:border-slate-700 text-[#2C3E50] dark:text-slate-200 focus:outline-none flex items-center justify-center"
            title="تبديل وضع القراءة الليلي"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-indigo-600" />}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-serif font-bold text-base text-[#2C3E50] dark:text-slate-100">
            كيمياء الثاني الثانوي
          </span>
          <img
            src="/icon-192.png"
            alt="شعار كيمياء نقلة"
            className="w-8 h-8 rounded-lg object-cover border border-emerald-400/50 shadow-2xs"
          />
        </div>
      </header>

      {/* Main layout wrapper */}
      <div className="flex flex-1 relative">
        {/* Sidebar Nav (Desktop & Mobile Drawer) */}
        <aside
          className={`${isFocusReading ? "hidden" : "lg:block"} shrink-0 bg-[#F9F8F6] dark:bg-slate-900 border-l border-[#E5E2DE] dark:border-slate-800 w-64 lg:w-72 fixed lg:static top-0 bottom-0 right-0 z-50 lg:z-auto transition-transform duration-300 transform ${
            isSidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="h-full flex flex-col justify-between p-5">
            <div className="space-y-4 flex-1 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                {/* Branding Section */}
                <div className="hidden lg:flex items-center gap-3 justify-end border-b border-[#E5E2DE] dark:border-slate-800 pb-4">
                  <div className="text-right">
                    <span className="font-serif font-bold text-lg text-[#2C3E50] dark:text-white">
                      الكيمياء التفاعلية
                    </span>
                    <span className="block text-[10px] text-[#7F8C8D] dark:text-slate-400 font-medium mt-0.5">منهج السودان • الثاني الثانوي</span>
                  </div>
                  <img
                    src="/icon-192.png"
                    alt="شعار كيمياء نقلة"
                    className="w-10 h-10 rounded-xl object-cover border border-emerald-500/40 shadow-sm"
                  />
                </div>

                {/* 🇸🇩 Student Profile & Indicators Card (Naqla SSO) */}
                <div className="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-[#E5E2DE] dark:border-slate-800 shadow-xs space-y-2.5">
                  <div className="flex items-center gap-2.5 justify-end">
                    <div className="text-right flex-1 min-w-0">
                      <span className="text-xs font-bold text-[#2C3E50] dark:text-white truncate block">
                        {currentUser?.username || currentUser?.name || "طالب نقلة المتميز"}
                      </span>
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1 justify-end mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>منصة نقلة 🇸🇩</span>
                      </span>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                  </div>

                  <button
                    onClick={() => setIsProfileModalOpen(true)}
                    className="w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-100/80 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-[#047857] dark:text-emerald-300 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>المؤشرات والإعدادات ⚙️</span>
                  </button>
                </div>

                {/* Navigation Items */}
                <nav className="space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id as TabType);
                          setIsSidebarOpen(false);
                        }}
                        className={`w-full px-3.5 py-3 rounded-xl text-xs font-bold flex items-center gap-3 justify-end transition-all cursor-pointer ${
                          isActive
                            ? "bg-white dark:bg-slate-800 text-[#047857] dark:text-emerald-400 border border-[#047857]/30 shadow-xs"
                            : "text-[#7F8C8D] dark:text-slate-400 hover:text-[#2C3E50] dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/40"
                        }`}
                      >
                        <span className="font-sans text-right">{item.label}</span>
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#047857] dark:text-emerald-400" : "text-[#95A5A6]"}`} />
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* App Settings & Reading Comfort */}
              <div className="pt-3 border-t border-[#E5E2DE] dark:border-slate-800 space-y-2.5 text-right">
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-200/70 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className="text-[11px]">لوحة المؤشرات الأكاديمية</span>
                  <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {/* Dark Mode Toggle Switch */}
                <div className="bg-white/80 dark:bg-slate-800/80 p-2.5 rounded-xl border border-[#E5E2DE] dark:border-slate-800 flex items-center justify-between flex-row-reverse transition-all">
                  <div className="flex items-center gap-2 flex-row-reverse">
                    {isDarkMode ? (
                      <Sun className="w-4 h-4 text-amber-500 shrink-0" />
                    ) : (
                      <Moon className="w-4 h-4 text-[#047857] shrink-0" />
                    )}
                    <span className="text-xs font-bold text-[#2C3E50] dark:text-slate-200">وضع القراءة الليلي</span>
                  </div>
                  
                  <button
                    onClick={toggleDarkMode}
                    type="button"
                    className={`w-10 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none cursor-pointer flex items-center ${
                      isDarkMode ? "bg-emerald-600 justify-start" : "bg-[#BDC3C7] justify-end"
                    }`}
                  >
                    <motion.div
                      layout
                      className="bg-white w-4 h-4 rounded-full shadow-sm"
                    />
                  </button>
                </div>
              </div>
            </div>


            {/* Bottom Credits block */}
            <div className="border-t border-[#E5E2DE] pt-4 text-center space-y-1 text-[#95A5A6]">
              <span className="text-[10px] block font-bold tracking-wide font-sans">سلسلة نقلة للمناهج الإلكترونية</span>
              <span className="text-[9px] block font-mono">CHEMISTRY 2ND SECONDARY</span>
            </div>
          </div>
        </aside>

        {/* Backdrop for mobile drawer */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
          />
        )}

        {/* Primary Page Canvas */}
        <main className={`flex-1 overflow-y-auto px-3 sm:px-6 md:px-8 py-4 sm:py-6 pb-24 lg:pb-8 w-full space-y-6 transition-all duration-300 ${isFocusReading ? "max-w-full" : "max-w-7xl mx-auto"}`}>
          {/* Offline Notification Banner */}
          <AnimatePresence>
            {isOffline && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="bg-amber-500/10 border-r-4 border-amber-500 text-amber-800 dark:bg-amber-500/5 dark:text-amber-400 p-4 rounded-xl flex items-start gap-3 flex-row-reverse text-right overflow-hidden shadow-sm transition-all"
              >
                <div className="p-2 bg-amber-500/20 dark:bg-amber-500/10 rounded-lg shrink-0">
                  <WifiOff className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-extrabold font-sans">وضع المذاكرة دون اتصال مفعّل (Offline)</h4>
                  <p className="text-[11px] leading-relaxed font-sans opacity-90">
                    أنت الآن تتصفح منصة الكيمياء بنجاح وبدون اتصال شبكة. جميع الدروس، محاكاة المعامل التفاعلية، بطاقات التثبيت والمراجعة السريعة مخزنة بالكامل على متصفحك لضمان استمرارية دراستك في أي وقت.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {activeTab === "dashboard" && (
                <Dashboard
                  completedLessons={completedLessons}
                  completedLabs={completedLabs}
                  quizScores={quizScores}
                  activeTabSetter={(tab) => setActiveTab(tab as TabType)}
                  onNavigateToLesson={(lessonId) => {
                    setSelectedLessonId(lessonId);
                    setActiveTab("syllabus");
                  }}
                />
              )}
              {activeTab === "syllabus" && (
                <SyllabusView
                  completedLessons={completedLessons}
                  toggleLessonComplete={toggleLessonComplete}
                  favoriteLessons={favoriteLessons}
                  toggleLessonFavorite={toggleLessonFavorite}
                  selectedLessonId={selectedLessonId}
                  setSelectedLessonId={setSelectedLessonId}
                  onNavigateToLab={(expId) => {
                    setSelectedExperimentId(expId);
                    setActiveTab("lab");
                  }}
                  isFocusReading={isFocusReading}
                  setIsFocusReading={setIsFocusReading}
                />
              )}
              {activeTab === "worksheets" && (
                <WorksheetGenerator
                  favoriteLessons={favoriteLessons}
                  toggleLessonFavorite={toggleLessonFavorite}
                />
              )}
              {activeTab === "lab" && (
                <VirtualLab
                  selectedExperimentId={selectedExperimentId}
                  setSelectedExperimentId={setSelectedExperimentId}
                  completedLabs={completedLabs}
                  onLabComplete={handleLabComplete}
                />
              )}
              {activeTab === "glossary" && <GlossaryView />}
              {activeTab === "quiz" && (
                <QuizView 
                  quizScores={quizScores} 
                  onSaveScore={handleSaveScore} 
                  favoriteLessons={favoriteLessons}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      {/* 📱 Native Mobile Bottom Navigation Bar (شريط التنقل السفلي المخصص للجوال) */}
      <nav aria-label="شريط التنقل السريع للجوال" className={`${isFocusReading ? "hidden" : "lg:hidden flex"} fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg px-2 py-1.5 items-center justify-around`}>
        {/* 1. الرئيسية */}
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === "dashboard" ? "text-[#047857] font-bold" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Award className={`w-5 h-5 ${activeTab === "dashboard" ? "text-[#047857]" : "text-slate-400"}`} />
          <span className="text-[10px] font-sans">الرئيسية</span>
        </button>

        {/* 2. الدروس */}
        <button
          onClick={() => setActiveTab("syllabus")}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === "syllabus" ? "text-[#047857] font-bold" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <BookOpen className={`w-5 h-5 ${activeTab === "syllabus" ? "text-[#047857]" : "text-slate-400"}`} />
          <span className="text-[10px] font-sans">الدروس</span>
        </button>

        {/* 3. المعمل (21) */}
        <button
          onClick={() => setActiveTab("lab")}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === "lab" ? "text-[#E67E22] font-bold" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <FlaskConical className={`w-5 h-5 ${activeTab === "lab" ? "text-[#E67E22]" : "text-slate-400"}`} />
          <span className="text-[10px] font-sans">المعمل (21)</span>
        </button>

        {/* 4. أوراق العمل */}
        <button
          onClick={() => setActiveTab("worksheets")}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === "worksheets" ? "text-[#047857] font-bold" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <FileText className={`w-5 h-5 ${activeTab === "worksheets" ? "text-[#047857]" : "text-slate-400"}`} />
          <span className="text-[10px] font-sans">أوراق العمل</span>
        </button>

        {/* 5. مؤشراتي */}
        <button
          onClick={() => setIsProfileModalOpen(true)}
          className="flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all cursor-pointer text-slate-500 hover:text-[#047857]"
        >
          <GraduationCap className="w-5 h-5 text-emerald-600" />
          <span className="text-[10px] font-sans">مؤشراتي</span>
        </button>
      </nav>

      <StudentAssistant />

      {/* 🇸🇩 Student Profile & Indicators Modal */}
      <StudentProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        completedLessons={completedLessons}
        completedLabs={completedLabs}
        quizScores={quizScores}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        isOffline={isOffline}
        onNavigateToTab={(tab) => {
          setActiveTab(tab as TabType);
          setIsProfileModalOpen(false);
        }}
      />

      {/* Exit Confirmation Dialog Modal */}
      <AnimatePresence>
        {isExitModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExitModalOpen(false)}
              className="absolute inset-0 bg-slate-800/40 backdrop-blur-xs"
            />
            
            {/* Dialog Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-white border border-slate-200 max-w-md w-full rounded-2xl shadow-xl p-6 relative z-10 text-right space-y-5"
              dir="rtl"
            >
              <div className="flex items-start gap-3 flex-row-reverse">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                  <span className="text-2xl">⚠️</span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-bold text-slate-800">هل أنت متأكد من مغادرة المنصة؟</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    يمكنك دائماً العودة لاحقاً لإكمال المذاكرة ومراجعة البطاقات التعليمية والمعمل الافتراضي مجاناً حتى بدون اتصال إنترنت.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setIsExitModalOpen(false)}
                  className="px-4 py-2.5 bg-[#047857] hover:bg-[#036549] text-white font-bold text-xs rounded-xl cursor-pointer transition-all shadow-xs text-center font-sans"
                >
                  البقاء ومتابعة المذاكرة
                </button>
                <button
                  onClick={() => {
                    setIsExitModalOpen(false);
                    window.location.href = "about:blank";
                  }}
                  className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs rounded-xl cursor-pointer transition-all text-center font-sans"
                >
                  نعم، أريد المغادرة
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

