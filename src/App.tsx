import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Dashboard } from "./components/Dashboard";
import { SyllabusView } from "./components/SyllabusView";
import { VirtualLab } from "./components/VirtualLab";
import { GlossaryView } from "./components/GlossaryView";
import { QuizView } from "./components/QuizView";
import { StudentAssistant } from "./components/StudentAssistant";
import { WorksheetGenerator } from "./components/WorksheetGenerator";
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
  Minimize2
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
    { id: "dashboard", label: "الرئيسة والمؤشرات", icon: Award },
    { id: "syllabus", label: "قسم المنهج والدروس", icon: BookOpen },
    { id: "worksheets", label: "توليد أوراق العمل", icon: FileText },
    { id: "lab", label: "المعمل الكيميائي التفاعلي", icon: FlaskConical },
    { id: "glossary", label: "المصطلحات العلمية", icon: Atom },
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
      <header className={`${isFocusReading ? "hidden" : "lg:hidden flex"} bg-white/95 backdrop-blur border-b border-[#E5E2DE] sticky top-0 z-40 px-4 py-3 justify-between items-center`}>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded bg-[#F9F8F6] border border-[#E5E2DE] hover:bg-[#E5E2DE] text-[#2C3E50] focus:outline-none"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <button
            onClick={toggleDarkMode}
            className="p-1.5 rounded bg-[#F9F8F6] border border-[#E5E2DE] hover:bg-[#E5E2DE] text-[#2C3E50] focus:outline-none flex items-center justify-center"
            title="تبديل وضع القراءة الليلي"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-indigo-600" />}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-serif font-bold text-lg text-[#2C3E50]">
            كيمياء الثاني الثانوي
          </span>
          <Atom className="w-6 h-6 text-[#E67E22] animate-spin" style={{ animationDuration: "12s" }} />
        </div>
      </header>

      {/* Main layout wrapper */}
      <div className="flex flex-1 relative">
        {/* Sidebar Nav (Desktop & Mobile Drawer) */}
        <aside
          className={`${isFocusReading ? "hidden" : "lg:block"} shrink-0 bg-[#F9F8F6] border-l border-[#E5E2DE] w-64 lg:w-72 fixed lg:static top-0 bottom-0 right-0 z-50 lg:z-auto transition-transform duration-300 transform ${
            isSidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="h-full flex flex-col justify-between p-6">
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              <div className="space-y-6">
                {/* Branding Section */}
                <div className="hidden lg:flex items-center gap-3 justify-end border-b border-[#E5E2DE] pb-5">
                  <div className="text-right">
                    <span className="font-serif font-bold text-xl text-[#2C3E50]">
                      الكيمياء التفاعلية
                    </span>
                    <span className="block text-[10px] text-[#7F8C8D] font-medium mt-0.5">منهج السودان • الثاني الثانوي</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#2C3E50] flex items-center justify-center text-white shadow-md">
                    <Atom className="w-6 h-6 text-white animate-spin" style={{ animationDuration: "12s" }} />
                  </div>
                </div>

                {/* Navigation Items */}
                <nav className="space-y-1.5">
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
                        className={`w-full px-4 py-3.5 rounded-lg text-xs font-bold flex items-center gap-3 justify-end transition-all ${
                          isActive
                            ? "bg-white text-[#2C3E50] border-r-4 border-[#E67E22] border-y border-l border-[#E5E2DE] shadow-sm"
                            : "text-[#7F8C8D] hover:text-[#2C3E50] hover:bg-white/50"
                        }`}
                      >
                        <span className="font-sans text-right">{item.label}</span>
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#E67E22]" : "text-[#95A5A6]"}`} />
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* App Settings & Reading Comfort */}
              <div className="pt-4 border-t border-[#E5E2DE] space-y-3 text-right">
                <span className="text-[10px] font-bold text-[#95A5A6] block font-sans uppercase">إعدادات التطبيق والمذاكرة</span>
                
                {/* Dark Mode Toggle Switch */}
                <div className="bg-white/70 dark:bg-[#1E1E24]/70 p-3 rounded-lg border border-[#E5E2DE] dark:border-slate-800 flex items-center justify-between flex-row-reverse transition-all">
                  <div className="flex items-center gap-2 flex-row-reverse">
                    {isDarkMode ? (
                      <Sun className="w-4 h-4 text-amber-500 shrink-0" />
                    ) : (
                      <Moon className="w-4 h-4 text-[#E67E22] shrink-0" />
                    )}
                    <span className="text-xs font-bold text-[#2C3E50]">وضع القراءة الليلي</span>
                  </div>
                  
                  {/* Premium RTL Switch with Layout animation */}
                  <button
                    onClick={toggleDarkMode}
                    type="button"
                    className={`w-10 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none cursor-pointer flex items-center ${
                      isDarkMode ? "bg-[#E67E22] justify-start" : "bg-[#BDC3C7] justify-end"
                    }`}
                  >
                    <motion.div
                      layout
                      className="bg-white w-4 h-4 rounded-full shadow-sm"
                    />
                  </button>
                </div>
                
                <p className="text-[10px] text-[#95A5A6] leading-normal font-sans text-right">
                  * يُنصح بتفعيله لتقليل إجهاد شبكية العين ومساعدتك على التركيز خلال فترات المذاكرة الطويلة.
                </p>
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
        <main className={`flex-1 overflow-y-auto px-4 md:px-8 py-6 w-full space-y-6 transition-all duration-300 ${isFocusReading ? "max-w-full" : "max-w-7xl mx-auto"}`}>
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
      <StudentAssistant />

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
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Dialog Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-white dark:bg-[#1A1A1E] border border-[#E5E2DE] dark:border-slate-800 max-w-md w-full rounded-2xl shadow-2xl p-6 relative z-10 text-right space-y-5"
              dir="rtl"
            >
              <div className="flex items-start gap-3 flex-row-reverse">
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center shrink-0">
                  <span className="text-2xl">⚠️</span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-serif font-extrabold text-[#2C3E50] dark:text-white">هل أنت متأكد من مغادرة التطبيق؟</h3>
                  <p className="text-xs text-[#7F8C8D] dark:text-slate-400 leading-relaxed">
                    سيتم مغادرة التطبيق وتوجيهك لصفحة فارغة. يمكنك دائماً العودة لاحقاً لإكمال المذاكرة ومراجعة البطاقات التعليمية مجاناً حتى بدون اتصال إنترنت.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setIsExitModalOpen(false)}
                  className="px-4 py-3 bg-[#2C3E50] hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer transition-all shadow-sm text-center font-sans"
                >
                  البقاء ومتابعة المذاكرة
                </button>
                <button
                  onClick={() => {
                    setIsExitModalOpen(false);
                    window.location.href = "about:blank";
                  }}
                  className="px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 dark:bg-red-950/20 dark:hover:bg-red-950/40 dark:border-red-900/50 font-bold text-xs rounded-xl cursor-pointer transition-all text-center font-sans"
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
