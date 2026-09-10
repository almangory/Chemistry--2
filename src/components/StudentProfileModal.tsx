import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  User, 
  Award, 
  BookOpen, 
  FlaskConical, 
  CheckSquare, 
  TrendingUp, 
  Moon, 
  Sun, 
  Wifi, 
  WifiOff, 
  ExternalLink,
  Sparkles,
  ShieldCheck,
  GraduationCap
} from "lucide-react";
import { curriculumData } from "../data/curriculum";

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
  completedLessons: string[];
  completedLabs: string[];
  quizScores: Record<string, number>;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isOffline: boolean;
  onNavigateToTab?: (tab: string) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  completedLessons,
  completedLabs,
  quizScores,
  isDarkMode,
  toggleDarkMode,
  isOffline,
  onNavigateToTab
}) => {
  if (!isOpen) return null;

  const totalLessonsCount = 28; // Total lessons across 6 units
  const totalLabsCount = 21;
  const totalUnitsCount = 6;

  const syllabusPercentage = Math.round((completedLessons.length / totalLessonsCount) * 100);
  const labsPercentage = Math.round((completedLabs.length / totalLabsCount) * 100);

  const examsCompleted = Object.keys(quizScores).length;
  const averageScore = examsCompleted > 0
    ? Math.round((Object.values(quizScores) as number[]).reduce((a, b) => a + b, 0) / examsCompleted)
    : 0;

  // Derive student name
  const studentName = currentUser?.username || currentUser?.name || currentUser?.displayName || "طالب نقلة المتميز";
  const studentRole = currentUser?.role || "طالب • الصف الثاني الثانوي";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" dir="rtl">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Dialog Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl bg-white dark:bg-[#1E1E24] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 my-8"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-l from-[#064E3B] via-[#047857] to-[#059669] p-6 text-white relative">
            <button
              onClick={onClose}
              className="absolute left-4 top-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none"
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-2xl shadow-inner font-bold">
                <GraduationCap className="w-9 h-9 text-emerald-300" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold font-sans tracking-tight">{studentName}</h3>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/20 text-white border border-white/30 backdrop-blur-sm">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                    منصة نقلة 🇸🇩
                  </span>
                </div>
                <p className="text-xs text-emerald-100 font-sans">{studentRole} • مادة الكيمياء</p>
                <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>متصل بالدخول الموحد التلقائي (SSO)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Section: Achievement Indicators (The 4 Metrics) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#047857]" />
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-sans">
                    مؤشرات الإنجاز الأكاديمي والتحصيل
                  </h4>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">المنهج السوداني القومي</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Metric 1: Lessons Completed */}
                <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/60 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">الدروس المنجزة</span>
                    <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                      <BookOpen className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-black font-mono text-emerald-700 dark:text-emerald-400">
                      {completedLessons.length}
                    </span>
                    <span className="text-xs text-slate-500">من {totalLessonsCount} درساً</span>
                  </div>
                  <div className="mt-2.5 w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${syllabusPercentage}%` }}
                      className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full transition-all duration-500"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block text-left font-mono">{syllabusPercentage}% مكتمل</span>
                </div>

                {/* Metric 2: Virtual Labs */}
                <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/60 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">التجارب المعملية</span>
                    <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
                      <FlaskConical className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400">
                      {completedLabs.length}
                    </span>
                    <span className="text-xs text-slate-500">من {totalLabsCount} تجربة تفاعلية</span>
                  </div>
                  <div className="mt-2.5 w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${labsPercentage}%` }}
                      className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block text-left font-mono">{labsPercentage}% مجرب</span>
                </div>

                {/* Metric 3: Quizzes */}
                <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/60 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">اختبارات الفصول</span>
                    <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400">
                      <CheckSquare className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-black font-mono text-blue-600 dark:text-blue-400">
                      {examsCompleted}
                    </span>
                    <span className="text-xs text-slate-500">من {totalUnitsCount} وحدات</span>
                  </div>
                  <div className="mt-2.5 w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${Math.round((examsCompleted / totalUnitsCount) * 100)}%` }}
                      className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block text-left font-mono">
                    {Math.round((examsCompleted / totalUnitsCount) * 100)}% تم تقييمها
                  </span>
                </div>

                {/* Metric 4: Average Score */}
                <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/60 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">معدل التحصيل الإجمالي</span>
                    <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-black font-mono text-purple-600 dark:text-purple-400">
                      {averageScore}%
                    </span>
                    <span className="text-xs text-slate-500">
                      {averageScore >= 85 ? "ممتاز جداً 🌟" : averageScore >= 65 ? "جيد 👏" : "مبتدئ 🚀"}
                    </span>
                  </div>
                  <div className="mt-2.5 w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${averageScore}%` }}
                      className="h-full bg-purple-600 rounded-full transition-all duration-500"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block text-left font-mono">{averageScore}% متوسط الدرجات</span>
                </div>
              </div>
            </div>

            {/* Section: Unit-by-Unit Quick Breakdown */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-600 dark:text-slate-300 font-sans">
                تفصيل إنجاز الوحدات الدراسية الست:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {curriculumData.map((unit) => {
                  const unitLessonIds = unit.lessons.map(l => l.id);
                  const completedInUnit = completedLessons.filter(id => unitLessonIds.includes(id)).length;
                  const unitPct = Math.round((completedInUnit / unit.lessons.length) * 100);
                  const unitQuizScore = quizScores[unit.id];

                  return (
                    <div 
                      key={unit.id}
                      className="p-2.5 rounded-lg bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/40 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-800 dark:text-slate-200 truncate">
                            {unit.number}. {unit.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                            <div style={{ width: `${unitPct}%` }} className="h-full bg-[#047857] rounded-full" />
                          </div>
                          <span className="text-[10px] font-mono text-slate-500">{completedInUnit}/{unit.lessons.length}</span>
                        </div>
                      </div>

                      <div className="shrink-0 text-left font-mono">
                        {unitQuizScore !== undefined ? (
                          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                            {unitQuizScore}%
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                            لم يُختبر
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section: App Settings & Study Comfort */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 font-sans">
                إعدادات العرض والراحة الدراسية
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Dark Mode Switch */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-slate-700 text-amber-600 dark:text-amber-400">
                      {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                    </div>
                    <div>
                      <span className="text-xs font-bold block text-slate-800 dark:text-slate-200">وضع القراءة الليلي</span>
                      <span className="text-[10px] text-slate-500">حماية العين أثناء المذاكرة</span>
                    </div>
                  </div>

                  <button
                    onClick={toggleDarkMode}
                    type="button"
                    className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 flex items-center cursor-pointer ${
                      isDarkMode ? "bg-emerald-600 justify-start" : "bg-slate-300 justify-end"
                    }`}
                  >
                    <motion.div layout className="bg-white w-4 h-4 rounded-full shadow-md" />
                  </button>
                </div>

                {/* Offline Mode Indicator */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-slate-700 text-emerald-600 dark:text-emerald-400">
                      {isOffline ? <WifiOff className="w-4 h-4 text-amber-500" /> : <Wifi className="w-4 h-4" />}
                    </div>
                    <div>
                      <span className="text-xs font-bold block text-slate-800 dark:text-slate-200">
                        {isOffline ? "وضع دون اتصال (Offline)" : "متصل بالشبكة (Online)"}
                      </span>
                      <span className="text-[10px] text-slate-500">المحتوى محفوظ محلياً بالكامل</span>
                    </div>
                  </div>
                  <span className={`w-2.5 h-2.5 rounded-full ${isOffline ? "bg-amber-500" : "bg-emerald-500 animate-pulse"}`} />
                </div>
              </div>
            </div>

            {/* Naqla Unified Portal Link */}
            <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-200">
              <div className="flex items-center gap-2">
                <span className="text-base">🇸🇩</span>
                <div>
                  <span className="font-bold block">بوابة المناهج السودانية التفاعلية</span>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400">مزامنة التقدم الأكاديمي مع حساب نقلة المركزي</span>
                </div>
              </div>

              <a
                href="https://sudan-interactive-curricula.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 transition-colors"
              >
                <span>المنصة الرئيسية</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold font-sans transition-colors"
            >
              تم وإغلاق
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
