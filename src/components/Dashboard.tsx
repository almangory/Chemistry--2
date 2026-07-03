import React from "react";
import { Award, BookOpen, FlaskConical, CheckSquare, Sparkles, TrendingUp } from "lucide-react";
import { SudanCaseStudies } from "./SudanCaseStudies";
import { SmartReview } from "./SmartReview";

interface DashboardProps {
  completedLessons: string[];
  completedLabs: string[];
  quizScores: Record<string, number>;
  activeTabSetter: (tab: string) => void;
  onNavigateToLesson: (lessonId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  completedLessons,
  completedLabs,
  quizScores,
  activeTabSetter,
  onNavigateToLesson
}) => {
  const totalLessonsCount = 21; // Exactly 21 lessons across 6 units
  const totalLabsCount = 21;    // Exactly 21 matching interactive virtual lab experiments
  const totalUnitsCount = 6;

  // Calculate percentage of curriculum read
  const syllabusPercentage = Math.round((completedLessons.length / totalLessonsCount) * 100);
  const labsPercentage = Math.round((completedLabs.length / totalLabsCount) * 100);

  // Completed exams count
  const examsCompleted = Object.keys(quizScores).length;
  const averageScore = examsCompleted > 0
    ? Math.round((Object.values(quizScores) as number[]).reduce((a, b) => a + b, 0) / examsCompleted)
    : 0;

  // Badges lists
  const badges = [
    { id: "b1", title: "خبير الجدول الدوري", unit: "الوحدة 1", desc: "اكتملت جميع دروس الترتيب الدوري للعناصر واختباراتها.", icon: "🌟", color: "from-blue-600 to-indigo-600" },
    { id: "b2", title: "مستكشف الأقلاء", unit: "الوحدة 2", desc: "أجرى بنجاح محاكاة تفاعل الصوديوم واستخلاصه.", icon: "🔥", color: "from-orange-500 to-amber-500" },
    { id: "b3", title: "مهندس الكيمياء العضوية", unit: "الوحدة 3", desc: "أتقن تسمية IUPAC وكشف الرابطة الثنائية.", icon: "🌿", color: "from-emerald-500 to-teal-500" },
    { id: "b4", title: "سيد النيتروجين والغازات", unit: "الوحدة 4", desc: "فهم تثبيت النيتروجين وصناعة هيدرات الأمونيا.", icon: "💨", color: "from-purple-500 to-fuchsia-500" },
    { id: "b5", title: "صانع الأملاح", unit: "الوحدة 5", desc: "اكتملت جميع دروس الكلور وأكسدة الهيدروجين.", icon: "🧂", color: "from-red-500 to-rose-500" },
    { id: "b6", title: "صائغ العناصر الانتقالية", unit: "الوحدة 6", desc: "أتقن كيمياء d5 وd10 والماء الملكي الاستثنائي.", icon: "👑", color: "from-slate-600 to-zinc-600" }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-white border border-[#E5E2DE] rounded-lg p-6 md:p-8 text-right shadow-sm">
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#F9F8F6]/50 rounded-full blur-3xl -translate-x-20 -translate-y-20" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="order-2 md:order-1 flex gap-3 items-center">
            <button
              onClick={() => activeTabSetter("lab")}
              className="px-4 py-2 bg-[#E67E22] hover:bg-[#d6721b] text-white font-bold rounded-sm text-xs shadow-sm transition-all"
            >
              افتح المعمل التفاعلي
            </button>
            <button
              onClick={() => activeTabSetter("syllabus")}
              className="px-4 py-2 bg-transparent hover:bg-[#F9F8F6] text-[#2C3E50] font-bold rounded-sm text-xs border border-[#2C3E50] transition-all"
            >
              تصفح كتاب المنهج
            </button>
          </div>
          <div className="order-1 md:order-2 space-y-2 text-right">
            <div className="flex justify-end items-center gap-2">
              <span className="text-2xl md:text-3xl font-serif font-bold text-[#2C3E50] tracking-tight">أهلاً بك يا بطل الكيمياء!</span>
              <Sparkles className="w-6 h-6 text-[#E67E22] animate-pulse" />
            </div>
            <p className="text-xs text-[#7F8C8D] max-w-xl leading-relaxed">
              مرحباً بك في منصتك التفاعلية لدراسة كيمياء الصف الثاني الثانوي المنهج السوداني. استكشف الدروس البصرية الكاملة، اختبر معلوماتك، وأجرِ تجارب خطيرة بأمان تام في معملك الافتراضي.
            </p>
          </div>
        </div>
      </div>

      {/* Progress Cards Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Syllabus read progress */}
        <div className="bg-[#F9F8F6] border border-[#E5E2DE] p-5 rounded text-right flex flex-col justify-between h-36 shadow-sm">
          <div className="flex justify-between items-start">
            <BookOpen className="w-5 h-5 text-[#2C3E50]" />
            <span className="text-xs font-bold text-[#7F8C8D] font-sans uppercase tracking-wider">الدروس المنجزة</span>
          </div>
          <div className="space-y-1 mt-2">
            <span className="text-3xl font-serif font-bold text-[#2C3E50] font-mono">{completedLessons.length}</span>
            <span className="text-xs text-[#95A5A6] block">من أصل {totalLessonsCount} درس متاح</span>
          </div>
          <div className="w-full bg-[#E5E2DE] h-1.5 rounded-full overflow-hidden mt-3">
            <div style={{ width: `${syllabusPercentage}%` }} className="bg-[#2C3E50] h-full rounded-full" />
          </div>
        </div>

        {/* Card 2: Virtual Labs performed */}
        <div className="bg-[#F9F8F6] border border-[#E5E2DE] p-5 rounded text-right flex flex-col justify-between h-36 shadow-sm">
          <div className="flex justify-between items-start">
            <FlaskConical className="w-5 h-5 text-[#E67E22]" />
            <span className="text-xs font-bold text-[#7F8C8D] font-sans uppercase tracking-wider">التجارب المخبرية</span>
          </div>
          <div className="space-y-1 mt-2">
            <span className="text-3xl font-serif font-bold text-[#2C3E50] font-mono">{completedLabs.length}</span>
            <span className="text-xs text-[#95A5A6] block">من أصل {totalLabsCount} تجارب معملية</span>
          </div>
          <div className="w-full bg-[#E5E2DE] h-1.5 rounded-full overflow-hidden mt-3">
            <div style={{ width: `${labsPercentage}%` }} className="bg-[#E67E22] h-full rounded-full" />
          </div>
        </div>

        {/* Card 3: Evaluation Exams Completed */}
        <div className="bg-[#F9F8F6] border border-[#E5E2DE] p-5 rounded text-right flex flex-col justify-between h-36 shadow-sm">
          <div className="flex justify-between items-start">
            <CheckSquare className="w-5 h-5 text-[#E67E22]" />
            <span className="text-xs font-bold text-[#7F8C8D] font-sans uppercase tracking-wider">الاختبارات التقييمية</span>
          </div>
          <div className="space-y-1 mt-2">
            <span className="text-3xl font-serif font-bold text-[#2C3E50] font-mono">{examsCompleted}</span>
            <span className="text-xs text-[#95A5A6] block">من أصل {totalUnitsCount} اختبارات فصول</span>
          </div>
          <div className="w-full bg-[#E5E2DE] h-1.5 rounded-full overflow-hidden mt-3">
            <div style={{ width: `${Math.round((examsCompleted / totalUnitsCount) * 100)}%` }} className="bg-[#E67E22] h-full rounded-full" />
          </div>
        </div>

        {/* Card 4: Average Score */}
        <div className="bg-[#F9F8F6] border border-[#E5E2DE] p-5 rounded text-right flex flex-col justify-between h-36 shadow-sm">
          <div className="flex justify-between items-start">
            <TrendingUp className="w-5 h-5 text-[#2C3E50]" />
            <span className="text-xs font-bold text-[#7F8C8D] font-sans uppercase tracking-wider">معدل درجاتك</span>
          </div>
          <div className="space-y-1 mt-2">
            <span className="text-3xl font-serif font-bold text-[#2C3E50] font-mono">{averageScore}%</span>
            <span className="text-xs text-[#95A5A6] block">مجموع علامات اختباراتك</span>
          </div>
          <div className="w-full bg-[#E5E2DE] h-1.5 rounded-full overflow-hidden mt-3">
            <div style={{ width: `${averageScore}%` }} className="bg-[#2C3E50] h-full rounded-full" />
          </div>
        </div>
      </div>

      {/* Smart Performance Review based on strengths/weaknesses */}
      <SmartReview
        completedLessons={completedLessons}
        quizScores={quizScores}
        onNavigateToLesson={onNavigateToLesson}
        activeTabSetter={activeTabSetter}
      />

      {/* Sudan Real-world Case Studies */}
      <SudanCaseStudies />

      {/* Badges and Trophies cabinet */}
      <div>
        <div className="flex justify-between items-center mb-4 border-b border-[#E5E2DE] pb-2">
          <span className="text-xs text-[#95A5A6] font-bold tracking-widest font-mono">EARNED BADGES</span>
          <h3 className="text-xl font-serif font-bold text-[#2C3E50] text-right">خزانة أوسمتك ودروعك الكيميائية</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => {
            // A badge is earned if the unit exam score is >= 80% or unit lessons are completed
            const isEarned = (quizScores[badge.unit.replace("الوحدة ", "")] >= 80) || completedLessons.some(l => l.startsWith(`u${badge.unit.replace("الوحدة ", "")}`));
            return (
              <div
                key={badge.id}
                className={`p-4 rounded border text-right transition-all flex gap-4 items-center ${
                  isEarned
                    ? "bg-white border-[#E5E2DE] shadow-sm"
                    : "bg-[#F9F8F6]/60 border-[#E5E2DE]/50 opacity-40 select-none grayscale"
                }`}
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-1.5 justify-end">
                    <span className="text-[10px] bg-[#F9F8F6] text-[#7F8C8D] px-1.5 py-0.5 rounded border border-[#E5E2DE] font-mono font-bold">
                      {badge.unit}
                    </span>
                    <span className="font-bold text-sm text-[#2C3E50]">{badge.title}</span>
                  </div>
                  <p className="text-xs text-[#7F8C8D] leading-relaxed">{badge.desc}</p>
                  {isEarned && (
                    <span className="inline-block text-[10px] text-emerald-600 font-bold font-sans mt-1">✓ تم الحصول عليه</span>
                  )}
                </div>
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center text-3xl shadow-sm shrink-0`}>
                  {badge.icon}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
