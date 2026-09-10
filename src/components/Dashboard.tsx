import React from "react";
import { 
  BookOpen, 
  FlaskConical, 
  CheckSquare, 
  Sparkles, 
  ArrowLeft, 
  FileText, 
  Atom, 
  Flame, 
  Layers, 
  CheckCircle2,
  ChevronLeft
} from "lucide-react";
import { curriculumData } from "../data/curriculum";
import { SudanCaseStudies } from "./SudanCaseStudies";

interface DashboardProps {
  completedLessons: string[];
  completedLabs: string[];
  quizScores: Record<string, number>;
  activeTabSetter: (tab: string) => void;
  onNavigateToLesson: (lessonId: string) => void;
  onNavigateToUnit?: (unitId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  completedLessons,
  completedLabs,
  quizScores,
  activeTabSetter,
  onNavigateToLesson,
  onNavigateToUnit
}) => {
  const totalLessonsCount = 28; // Total lessons across 6 units
  const totalLabsCount = 21;

  // Unit metadata styling (chemistry theme colors & badges)
  const unitBadges: Record<string, { icon: string; color: string; bg: string; borderColor: string; tag: string }> = {
    "1": { icon: "⚛️", color: "text-blue-700 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/40", borderColor: "border-blue-200 dark:border-blue-800", tag: "بنية الذرة والجدول الدوري" },
    "2": { icon: "⚡", color: "text-amber-700 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/40", borderColor: "border-amber-200 dark:border-amber-800", tag: "عناصر s-block القلوية" },
    "3": { icon: "🌿", color: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/40", borderColor: "border-emerald-200 dark:border-emerald-800", tag: "الكيمياء العضوية والهيدروكربونات" },
    "4": { icon: "💨", color: "text-purple-700 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-950/40", borderColor: "border-purple-200 dark:border-purple-800", tag: "النيتروجين وتآصل الفوسفور" },
    "5": { icon: "🧂", color: "text-rose-700 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-950/40", borderColor: "border-rose-200 dark:border-rose-800", tag: "الهالوجينات والكلور" },
    "6": { icon: "🔩", color: "text-slate-700 dark:text-slate-300", bg: "bg-slate-100 dark:bg-slate-800/50", borderColor: "border-slate-300 dark:border-slate-700", tag: "العناصر الانتقالية والحديد" }
  };

  const handleOpenUnit = (unitId: string) => {
    const unit = curriculumData.find(u => u.id === unitId);
    if (unit && unit.lessons.length > 0) {
      onNavigateToLesson(unit.lessons[0].id);
    } else {
      activeTabSetter("syllabus");
    }
  };

  return (
    <div className="space-y-8 text-right" dir="rtl">
      {/* 🌟 1. Compact & Inspiring Chemistry Welcome Hero */}
      <div className="relative overflow-hidden bg-gradient-to-l from-[#064E3B] via-[#047857] to-[#059669] rounded-2xl p-6 md:p-8 text-white shadow-lg">
        {/* Background decorative chemical orbits */}
        <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 right-1/3 w-40 h-40 rounded-full bg-emerald-300/10 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-emerald-100 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>منهج الكيمياء التفاعلي • جمهورية السودان (بخت الرضا)</span>
            </div>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif font-black tracking-tight text-white leading-tight">
              أهلاً بك في منصة كيمياء الصف الثاني الثانوي 🧪
            </h1>

            <p className="text-xs md:text-sm text-emerald-100 leading-relaxed font-sans opacity-95">
              رحلتك التعليمية الميسرة لدراسة وتطبيق مفاهيم الكيمياء: تصفح الدروس المرتبة، أجرِ التجارب المعملية الخطيرة بأمان تام في المختبر الافتراضي، وطبّق أوراق العمل المعتمدة لامتحانات الشهادة.
            </p>

            {/* Quick Access Action Pills */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              <button
                onClick={() => activeTabSetter("syllabus")}
                className="px-4 py-2 bg-white text-[#064E3B] hover:bg-emerald-50 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all font-sans cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-[#047857]" />
                <span>تصفح وحدات المنهج</span>
              </button>

              <button
                onClick={() => activeTabSetter("lab")}
                className="px-4 py-2 bg-[#E67E22] hover:bg-[#d35400] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all font-sans cursor-pointer"
              >
                <FlaskConical className="w-4 h-4" />
                <span>المعمل الافتراضي (21 تجربة)</span>
              </button>

              <button
                onClick={() => activeTabSetter("worksheets")}
                className="px-4 py-2 bg-white/15 hover:bg-white/25 text-white border border-white/30 font-bold rounded-xl text-xs flex items-center gap-1.5 backdrop-blur-sm transition-all font-sans cursor-pointer"
              >
                <FileText className="w-4 h-4 text-emerald-200" />
                <span>أوراق العمل والطباعة</span>
              </button>

              <button
                onClick={() => activeTabSetter("glossary")}
                className="px-4 py-2 bg-white/15 hover:bg-white/25 text-white border border-white/30 font-bold rounded-xl text-xs flex items-center gap-1.5 backdrop-blur-sm transition-all font-sans cursor-pointer"
              >
                <Atom className="w-4 h-4 text-emerald-200" />
                <span>المعجم والمصطلحات</span>
              </button>
            </div>
          </div>

          {/* Quick status summary chip */}
          <div className="shrink-0 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center space-y-2 w-full sm:w-auto min-w-[200px]">
            <span className="text-[11px] text-emerald-200 font-bold block">حالة الدراسة الحالية</span>
            <div className="flex items-center justify-center gap-3">
              <div>
                <span className="text-2xl font-black font-mono block">{completedLessons.length}</span>
                <span className="text-[10px] text-emerald-100">دروس مكتملة</span>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div>
                <span className="text-2xl font-black font-mono block">{completedLabs.length}</span>
                <span className="text-[10px] text-emerald-100">تجارب مجربة</span>
              </div>
            </div>
            <span className="text-[10px] text-emerald-200 block pt-1 border-t border-white/15">
              المؤشرات الكاملة متاحة بقائمة الإعدادات ⚙️
            </span>
          </div>
        </div>
      </div>

      {/* 📚 2. Six Curriculum Units Portal (بوابة الوحدات الست للمنهج) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#047857] dark:text-emerald-400" />
            <h2 className="text-lg md:text-xl font-serif font-bold text-slate-900 dark:text-white">
              وحدات منهج كيمياء الصف الثاني الثانوي
            </h2>
          </div>
          <button
            onClick={() => activeTabSetter("syllabus")}
            className="text-xs font-bold text-[#047857] dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>عرض تفصيلي للدروس</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {curriculumData.map((unit) => {
            const badge = unitBadges[unit.id] || {
              icon: "🧪",
              color: "text-emerald-700",
              bg: "bg-emerald-50",
              borderColor: "border-emerald-200",
              tag: "وحدة دراسية"
            };

            const unitLessonIds = unit.lessons.map(l => l.id);
            const unitCompletedCount = completedLessons.filter(id => unitLessonIds.includes(id)).length;
            const unitPercentage = Math.round((unitCompletedCount / unit.lessons.length) * 100);
            const isFinished = unitPercentage === 100;

            return (
              <div
                key={unit.id}
                onClick={() => handleOpenUnit(unit.id)}
                className="group relative bg-white dark:bg-[#1E1E24] border border-slate-200 dark:border-slate-800 hover:border-[#047857] dark:hover:border-emerald-500 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top Bar: Unit Number & Badge */}
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${badge.bg} ${badge.color} ${badge.borderColor} flex items-center gap-1.5`}>
                      <span>{badge.icon}</span>
                      <span>الوحدة {unit.number}</span>
                    </span>

                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-bold">
                      {unit.lessons.length} دروس
                    </span>
                  </div>

                  {/* Title & Tag */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#047857] dark:group-hover:text-emerald-400 transition-colors font-sans leading-snug">
                      {unit.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-sans line-clamp-2">
                      {unit.lessons.map(l => l.title.replace(/^الدرس \d+:\s*/, "")).slice(0, 3).join(" • ")}
                    </p>
                  </div>
                </div>

                {/* Bottom: Progress Bar and Action */}
                <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 dark:text-slate-400 font-sans">
                      {isFinished ? (
                        <span className="text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          اكتملت الوحدة بالكامل
                        </span>
                      ) : (
                        <span>الإنجاز: {unitCompletedCount} من {unit.lessons.length} دروس</span>
                      )}
                    </span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                      {unitPercentage}%
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${unitPercentage}%` }}
                      className={`h-full rounded-full transition-all duration-500 ${
                        isFinished ? "bg-emerald-500" : "bg-[#047857]"
                      }`}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] font-bold text-[#047857] dark:text-emerald-400 group-hover:translate-x-[-3px] transition-transform flex items-center gap-1">
                      <span>ادخل إلى دروس الوحدة</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ⚗️ 3. Quick Interactive Virtual Lab Highlights */}
      <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-[#E67E22]" />
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-sans">
                تجارب مميزة في معمل الكيمياء الافتراضي
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                محاكاة تفاعلية خطوة بخطوة لأهم تجارب كتاب الكيمياء المدرسي مع المشاهدة والاستنتاج
              </p>
            </div>
          </div>

          <button
            onClick={() => activeTabSetter("lab")}
            className="px-4 py-2 bg-[#E67E22] hover:bg-[#d35400] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors shrink-0 font-sans cursor-pointer"
          >
            <span>جميع التجارب الـ 21</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Highlight 1: Methane */}
          <div 
            onClick={() => activeTabSetter("lab")}
            className="p-4 bg-white dark:bg-[#1E1E24] rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#E67E22] transition-colors cursor-pointer space-y-2"
          >
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 inline-block font-sans">
              الوحدة 3 • الكيمياء العضوية
            </span>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-sans">
              تحضير غاز الميثان بالتقطير الجاف
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
              تسخين خلات الصوديوم اللامائية مع الجير الصودي وجمع الغاز بإزاحة الماء لأسفل.
            </p>
          </div>

          {/* Highlight 2: Ethene & Bromine Water */}
          <div 
            onClick={() => activeTabSetter("lab")}
            className="p-4 bg-white dark:bg-[#1E1E24] rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#E67E22] transition-colors cursor-pointer space-y-2"
          >
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 inline-block font-sans">
              الوحدة 3 • تفاعلات الإضافة
            </span>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-sans">
              كشف عدم التشبع بماء البروم الأحمر
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
              التمييز العملي بين غاز الإيثين والإيثان، وزوال اللون الأحمر السريع في الإيثين.
            </p>
          </div>

          {/* Highlight 3: Ammonia Fountain */}
          <div 
            onClick={() => activeTabSetter("lab")}
            className="p-4 bg-white dark:bg-[#1E1E24] rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#E67E22] transition-colors cursor-pointer space-y-2"
          >
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 inline-block font-sans">
              الوحدة 4 • النشادر
            </span>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-sans">
              تجربة نافورة النشادر ومحلول دوار الشمس
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
              إثبات الشراهة الفائقة لذوبان غاز الأمونيا في الماء وخواصه القاعدية القوية.
            </p>
          </div>
        </div>
      </div>

      {/* 🇸🇩 4. Real-world Case Studies: Chemistry in Sudan */}
      <SudanCaseStudies />
    </div>
  );
};
