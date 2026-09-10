import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto" dir="rtl">
        {/* Backdrop (Soft blur, no pitch black) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-800/40 backdrop-blur-xs transition-opacity"
        />

        {/* Modal Dialog Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden z-10 my-6"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-l from-[#064E3B] via-[#047857] to-[#059669] p-5 text-white relative">
            <button
              onClick={onClose}
              className="absolute left-3.5 top-3.5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none cursor-pointer"
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3.5">
              <div className="w-13 h-13 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shadow-inner shrink-0">
                <GraduationCap className="w-7 h-7 text-emerald-200" />
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-bold font-sans tracking-tight text-white">{studentName}</h3>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white border border-white/30">
                    <ShieldCheck className="w-3 h-3 text-emerald-200" />
                    منصة نقلة 🇸🇩
                  </span>
                </div>
                <p className="text-xs text-emerald-100 font-sans">{studentRole} • كيمياء الثاني الثانوي</p>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-200 pt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>متصل بالدخول الموحد (SSO)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-5 space-y-5 max-h-[72vh] overflow-y-auto">
            {/* Section: Achievement Indicators (The 4 Metrics) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#047857]" />
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800 font-sans">
                    مؤشرات الإنجاز الأكاديمي والتحصيل
                  </h4>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">المنهج السوداني القومي</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {/* Metric 1: Lessons Completed */}
                <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700">الدروس المنجزة</span>
                    <BookOpen className="w-3.5 h-3.5 text-[#047857]" />
                  </div>
                  <div className="mt-1.5 flex items-baseline gap-1.5">
                    <span className="text-xl font-bold font-mono text-[#064E3B]">
                      {completedLessons.length}
                    </span>
                    <span className="text-[10px] text-slate-500">من {totalLessonsCount}</span>
                  </div>
                  <div className="mt-2 w-full bg-emerald-100 h-1.5 rounded-full overflow-hidden">
                    <div style={{ width: `${syllabusPercentage}%` }} className="h-full bg-[#047857] rounded-full" />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block text-left font-mono">{syllabusPercentage}%</span>
                </div>

                {/* Metric 2: Virtual Labs */}
                <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-100 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700">التجارب المعملية</span>
                    <FlaskConical className="w-3.5 h-3.5 text-amber-600" />
                  </div>
                  <div className="mt-1.5 flex items-baseline gap-1.5">
                    <span className="text-xl font-bold font-mono text-amber-700">
                      {completedLabs.length}
                    </span>
                    <span className="text-[10px] text-slate-500">من {totalLabsCount}</span>
                  </div>
                  <div className="mt-2 w-full bg-amber-100 h-1.5 rounded-full overflow-hidden">
                    <div style={{ width: `${labsPercentage}%` }} className="h-full bg-amber-500 rounded-full" />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block text-left font-mono">{labsPercentage}%</span>
                </div>

                {/* Metric 3: Quizzes */}
                <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700">اختبارات الفصول</span>
                    <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <div className="mt-1.5 flex items-baseline gap-1.5">
                    <span className="text-xl font-bold font-mono text-blue-700">
                      {examsCompleted}
                    </span>
                    <span className="text-[10px] text-slate-500">من {totalUnitsCount}</span>
                  </div>
                  <div className="mt-2 w-full bg-blue-100 h-1.5 rounded-full overflow-hidden">
                    <div style={{ width: `${Math.round((examsCompleted / totalUnitsCount) * 100)}%` }} className="h-full bg-blue-600 rounded-full" />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block text-left font-mono">
                    {Math.round((examsCompleted / totalUnitsCount) * 100)}%
                  </span>
                </div>

                {/* Metric 4: Average Score */}
                <div className="bg-purple-50/50 p-3 rounded-xl border border-purple-100 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700">معدل التحصيل</span>
                    <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
                  </div>
                  <div className="mt-1.5 flex items-baseline gap-1.5">
                    <span className="text-xl font-bold font-mono text-purple-700">
                      {averageScore}%
                    </span>
                    <span className="text-[10px] text-slate-500 font-sans">
                      {averageScore >= 80 ? "ممتاز 🌟" : averageScore >= 50 ? "جيد 👏" : "مستمر 🚀"}
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-purple-100 h-1.5 rounded-full overflow-hidden">
                    <div style={{ width: `${averageScore}%` }} className="h-full bg-purple-600 rounded-full" />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block text-left font-mono">{averageScore}%</span>
                </div>
              </div>
            </div>

            {/* Section: Unit-by-Unit Quick Breakdown */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 font-sans">
                تفصيل إنجاز الوحدات الدراسية:
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
                      className="p-2 rounded-lg bg-slate-50 border border-slate-200/70 flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-slate-800 truncate block text-[11px]">
                          {unit.number}. {unit.title}
                        </span>
                        <div className="flex items-center gap-1.5 mt-1">
                          <div className="flex-1 bg-slate-200 h-1 rounded-full overflow-hidden">
                            <div style={{ width: `${unitPct}%` }} className="h-full bg-[#047857] rounded-full" />
                          </div>
                          <span className="text-[10px] font-mono text-slate-500">{completedInUnit}/{unit.lessons.length}</span>
                        </div>
                      </div>

                      <div className="shrink-0 text-left font-mono">
                        {unitQuizScore !== undefined ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded">
                            {unitQuizScore}%
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">
                            -
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section: Offline Indicator & Naqla Link */}
            <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between text-xs text-emerald-900">
              <div className="flex items-center gap-2">
                <span className="text-sm">🇸🇩</span>
                <div>
                  <span className="font-bold block text-[11px]">منصة المناهج السودانية التفاعلية</span>
                  <span className="text-[10px] text-emerald-700">مزامنة البيانات والحساب مع منصة نقلة</span>
                </div>
              </div>

              <a
                href="https://sudan-interactive-curricula.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-lg bg-[#047857] text-white font-bold text-[10px] flex items-center gap-1"
              >
                <span>الرئيسية</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-[#047857] hover:bg-[#036549] text-white text-xs font-bold font-sans transition-colors cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
