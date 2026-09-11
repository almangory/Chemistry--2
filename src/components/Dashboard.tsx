import React from "react";
import { 
  BookOpen, 
  FlaskConical,
  CheckSquare, 
  Sparkles, 
  ArrowLeft, 
  FileText, 
  Atom, 
  Layers, 
  CheckCircle2,
  ChevronLeft,
  Video,
  FileText
} from "lucide-react";
import { curriculumData } from "../data/curriculum";
import { SudanCaseStudies } from "./SudanCaseStudies";
import { UnitMediaModal } from "./UnitMediaModal";
import { Unit } from "../types";

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
  // Unit metadata styling (pure light educational palette, NO black)
  const unitBadges: Record<string, { icon: string; color: string; bg: string; borderColor: string; tag: string }> = {
    "1": { icon: "⚛️", color: "text-blue-700", bg: "bg-blue-50/80", borderColor: "border-blue-200", tag: "بنية الذرة والجدول الدوري" },
    "2": { icon: "⚡", color: "text-amber-700", bg: "bg-amber-50/80", borderColor: "border-amber-200", tag: "عناصر s-block القلوية" },
    "3": { icon: "🌿", color: "text-emerald-700", bg: "bg-emerald-50/80", borderColor: "border-emerald-200", tag: "الكيمياء العضوية والهيدروكربونات" },
    "4": { icon: "💨", color: "text-purple-700", bg: "bg-purple-50/80", borderColor: "border-purple-200", tag: "النيتروجين وتآصل الفوسفور" },
    "5": { icon: "🧂", color: "text-rose-700", bg: "bg-rose-50/80", borderColor: "border-rose-200", tag: "الهالوجينات والكلور" },
    "6": { icon: "🔩", color: "text-teal-800", bg: "bg-teal-50/80", borderColor: "border-teal-200", tag: "العناصر الانتقالية والحديد" }
  };

  const [isMediaModalOpen, setIsMediaModalOpen] = React.useState<boolean>(false);
  const [mediaModalMode, setMediaModalMode] = React.useState<"video" | "pdf">("video");
  const [mediaTargetUnit, setMediaTargetUnit] = React.useState<Unit>(curriculumData[0]);

  const handleOpenMedia = (e: React.MouseEvent, unit: Unit, mode: "video" | "pdf") => {
    e.stopPropagation();
    setMediaTargetUnit(unit);
    setMediaModalMode(mode);
    setIsMediaModalOpen(true);
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
    <div className="space-y-6 text-right" dir="rtl">
      {/* 🧪 1. Compact, Slim & Elegant Chemistry Header Bar (المقاس الأنيق والمريح) */}
      <div className="bg-gradient-to-l from-[#064E3B] via-[#047857] to-[#059669] text-white rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-right w-full sm:w-auto">
          <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-xl shrink-0 shadow-inner">
            🧪
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-bold font-sans tracking-tight text-white">
                كيمياء الصف الثاني الثانوي
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-emerald-100 border border-white/20">
                منهج السودان 🇸🇩
              </span>
            </div>
            <p className="text-[11px] text-emerald-100/90 font-sans mt-0.5">
              الوحدات الست الرسمية المعتمدة • معمل افتراضي • بنك أوراق العمل
            </p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-start sm:justify-end overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => activeTabSetter("syllabus")}
            className="px-3.5 py-2 bg-white dark:bg-slate-800 text-[#064E3B] dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 shrink-0 shadow-xs transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#047857] dark:text-emerald-400" />
            <span>الوحدات والدروس</span>
          </button>

          <button
            onClick={() => activeTabSetter("lab")}
            className="px-3.5 py-2 bg-[#E67E22] hover:bg-[#d35400] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shrink-0 shadow-xs transition-colors cursor-pointer"
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>المعمل الافتراضي (21)</span>
          </button>

          <button
            onClick={() => activeTabSetter("worksheets")}
            className="px-3 py-2 bg-emerald-800/60 hover:bg-emerald-800 text-white border border-emerald-400/30 font-bold rounded-xl text-xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-200" />
            <span>أوراق العمل</span>
          </button>

          <button
            onClick={() => activeTabSetter("glossary")}
            className="px-3 py-2 bg-emerald-800/60 hover:bg-emerald-800 text-white border border-emerald-400/30 font-bold rounded-xl text-xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer hidden md:flex"
          >
            <Atom className="w-3.5 h-3.5 text-emerald-200" />
            <span>المعجم</span>
          </button>
        </div>
      </div>

      {/* 📚 2. Six Curriculum Units Portal (بوابة الوحدات الست للمنهج) */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#047857] dark:text-emerald-400" />
            <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 font-sans">
              وحدات منهج الكيمياء المقررة
            </h2>
          </div>
          <button
            onClick={() => activeTabSetter("syllabus")}
            className="text-xs font-bold text-[#047857] dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>استعراض كل الدروس</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {curriculumData.map((unit) => {
            const badge = unitBadges[unit.id] || {
              icon: "🧪",
              color: "text-emerald-700 dark:text-emerald-300",
              bg: "bg-emerald-50 dark:bg-emerald-950/60",
              borderColor: "border-emerald-200 dark:border-emerald-800/60",
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
                className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#047857] dark:hover:border-emerald-500 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  {/* Top Bar: Unit Number & Badge */}
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badge.bg} ${badge.color} ${badge.borderColor} flex items-center gap-1`}>
                      <span>{badge.icon}</span>
                      <span>الوحدة {unit.number}</span>
                    </span>

                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-bold">
                      {unit.lessons.length} دروس
                    </span>
                  </div>

                  {/* Title & Tag */}
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 group-hover:text-[#047857] dark:group-hover:text-emerald-400 transition-colors font-sans leading-snug">
                      {unit.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-sans line-clamp-2 leading-relaxed">
                      {unit.lessons.map(l => l.title.replace(/^الدرس \d+:\s*/, "")).slice(0, 3).join(" • ")}
                    </p>
                  </div>

                  {/* Unit Key Illustration Preview */}
                  {unit.lessons[0]?.image && (
                    <div className="relative w-full h-24 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 mt-1">
                      <img
                        src={unit.lessons[0].image}
                        alt={unit.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />
                      <span className="absolute bottom-1.5 right-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/95 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 backdrop-blur-xs shadow-2xs">
                        رسم توضيحي 🔬
                      </span>
                    </div>
                  )}
                </div>

                {/* Bottom: Progress Bar and Action */}
                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 dark:text-slate-400 font-sans">
                      {isFinished ? (
                        <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          اكتملت الوحدة بالكامل
                        </span>
                      ) : (
                        <span>تمت دراسة: {unitCompletedCount} من {unit.lessons.length}</span>
                      )}
                    </span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                      {unitPercentage}%
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${unitPercentage}%` }}
                      className={`h-full rounded-full transition-all duration-500 ${
                        isFinished ? "bg-emerald-600" : "bg-[#047857]"
                      }`}
                    />
                  </div>


                  {/* Quick Video & PDF Buttons */}
                  {unit.media && (
                    <div className="flex items-center gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={(e) => handleOpenMedia(e, unit, "video")}
                        className="flex-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 text-[#047857] dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                        title="مشاهدة فيديو شرح الوحدة"
                      >
                        <Video className="w-3 h-3" />
                        <span>فيديو الشرح 🎥</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleOpenMedia(e, unit, "pdf")}
                        className="flex-1 px-2.5 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/80 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                        title="تصفح أو تحميل مذكرة الوحدة PDF"
                      >
                        <FileText className="w-3 h-3" />
                        <span>مذكرة PDF 📄</span>
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-0.5">
                    <span className="text-[11px] font-bold text-[#047857] dark:text-emerald-400 group-hover:translate-x-[-3px] transition-transform flex items-center gap-0.5">
                      <span>ادخل إلى الدروس</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🇸🇩 3. Real-world Case Studies: Chemistry in Sudan */}
      <SudanCaseStudies />

      {/* 🎬 Unit Media Modal (Video Player & PDF Viewer) */}
      <UnitMediaModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        unit={mediaTargetUnit}
        initialMode={mediaModalMode}
      />
    </div>
  );
};
