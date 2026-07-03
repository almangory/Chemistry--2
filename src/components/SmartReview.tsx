import React from "react";
import { motion } from "motion/react";
import { curriculumData } from "../data/curriculum";
import { Lesson, Unit } from "../types";
import { 
  Sparkles, 
  BookOpen, 
  AlertTriangle, 
  CheckCircle, 
  ArrowLeft, 
  HelpCircle,
  TrendingDown,
  ChevronLeft
} from "lucide-react";

interface SmartReviewProps {
  completedLessons: string[];
  quizScores: Record<string, number>;
  onNavigateToLesson: (lessonId: string) => void;
  activeTabSetter: (tab: string) => void;
}

interface RecommendedLesson {
  lesson: Lesson;
  unit: Unit;
  reason: "weakness" | "incomplete" | "untested";
  score?: number;
  badgeText: string;
  badgeColor: string;
}

export const SmartReview: React.FC<SmartReviewProps> = ({
  completedLessons,
  quizScores,
  onNavigateToLesson,
  activeTabSetter
}) => {
  // Analyze performance to build recommendations
  const getRecommendations = (): RecommendedLesson[] => {
    const recommendations: RecommendedLesson[] = [];

    // 1. Identify units with weakness (quiz scores under 80%)
    const weaknessUnits = curriculumData
      .filter(u => quizScores[u.id] !== undefined && quizScores[u.id] < 80)
      .map(u => ({
        unit: u,
        score: quizScores[u.id]
      }))
      .sort((a, b) => a.score - b.score); // Prioritize lowest score first

    weaknessUnits.forEach(({ unit, score }) => {
      // Find up to 2 high-priority lessons in this unit
      // Prefer incomplete lessons first, then complete ones for review
      const incomplete = unit.lessons.filter(l => !completedLessons.includes(l.id));
      const complete = unit.lessons.filter(l => completedLessons.includes(l.id));

      const selectedLessons = [...incomplete, ...complete].slice(0, 2);
      selectedLessons.forEach(lesson => {
        recommendations.push({
          lesson,
          unit,
          reason: "weakness",
          score,
          badgeText: `تحتاج مراجعة (نتيجة الاختبار: ${score}%)`,
          badgeColor: "bg-amber-50 text-amber-800 border-amber-200"
        });
      });
    });

    // 2. Identify units with high activity but no quiz taken yet ("untested")
    curriculumData.forEach(unit => {
      const isAlreadyRecommended = recommendations.some(r => r.unit.id === unit.id);
      if (isAlreadyRecommended) return;

      const unitLessonsIds = unit.lessons.map(l => l.id);
      const readInUnitCount = completedLessons.filter(id => unitLessonsIds.includes(id)).length;

      // If user read at least 2 lessons in this unit but hasn't taken the unit quiz
      if (readInUnitCount >= 2 && quizScores[unit.id] === undefined) {
        // Suggest the next incomplete lesson, or first lesson if all done
        const nextLesson = unit.lessons.find(l => !completedLessons.includes(l.id)) || unit.lessons[0];
        recommendations.push({
          lesson: nextLesson,
          unit,
          reason: "untested",
          badgeText: "جاهز للتحدي واختبار معلوماتك 🧪",
          badgeColor: "bg-blue-50 text-blue-800 border-blue-200"
        });
      }
    });

    // 3. Fallback / general recommendations (incomplete lessons in order)
    if (recommendations.length < 3) {
      for (const unit of curriculumData) {
        for (const lesson of unit.lessons) {
          if (!completedLessons.includes(lesson.id)) {
            // Check if already recommended
            if (!recommendations.some(r => r.lesson.id === lesson.id)) {
              recommendations.push({
                lesson,
                unit,
                reason: "incomplete",
                badgeText: "الدرس القادم الموصى به كمنهج دراسي",
                badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-100"
              });
            }
          }
          if (recommendations.length >= 4) break;
        }
        if (recommendations.length >= 4) break;
      }
    }

    // Return unique suggestions up to 4
    return recommendations.slice(0, 4);
  };

  const recommendations = getRecommendations();
  const hasScores = Object.keys(quizScores).length > 0;
  const lowestScoreUnit = hasScores 
    ? curriculumData.find(u => quizScores[u.id] !== undefined && quizScores[u.id] < 80)
    : null;

  return (
    <div className="bg-white border border-[#E5E2DE] p-5 md:p-6 rounded-lg shadow-sm text-right space-y-5">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-[#E5E2DE] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 justify-end md:justify-start">
            <span className="bg-[#E67E22] text-white text-[10px] px-2 py-0.5 rounded-sm font-bold font-sans">توجيه ذكي</span>
            <h3 className="text-base font-serif font-bold text-[#2C3E50] flex items-center gap-1.5">
              مساعد المراجعة الذكية والتحليل الأكاديمي ✨
            </h3>
          </div>
          <p className="text-xs text-[#7F8C8D] font-sans">
            يقوم النظام بتحليل أدائك في الاختبارات وتقدمك بالمنهج لتقديم توصيات مخصصة تسد الفجوات التعليمية وتضمن تمكنك الكامل.
          </p>
        </div>

        {/* Short motivational checkup */}
        <div className="shrink-0">
          {lowestScoreUnit ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold font-sans">
              <AlertTriangle className="w-4 h-4 text-[#E67E22]" />
              تم اكتشاف مواطن ضعف مستهدفة تحتاج تدعيم
            </span>
          ) : hasScores ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs font-bold font-sans">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              أداء متميز في جميع اختباراتك حتى الآن! 🌟
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-gray-50 text-gray-600 border border-gray-200 text-xs font-bold font-sans">
              <HelpCircle className="w-4 h-4 text-gray-400" />
              ابدأ الاختبارات لتفعيل التحليل الفوري للأداء
            </span>
          )}
        </div>
      </div>

      {/* Suggested path grid */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-[#7F8C8D] font-sans uppercase tracking-wider">الدروس الموصى بمراجعتها حالياً:</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec, idx) => (
            <motion.div
              key={rec.lesson.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-[#F9F8F6] hover:bg-white border border-[#E5E2DE] hover:border-[#2C3E50] p-4 rounded text-right transition-all flex flex-col justify-between gap-3 shadow-xs"
            >
              <div className="space-y-2">
                {/* Meta Row */}
                <div className="flex justify-between items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border font-sans ${rec.badgeColor}`}>
                    {rec.badgeText}
                  </span>
                  <span className="text-[10px] text-gray-500 font-bold font-sans">
                    الوحدة {rec.unit.number}
                  </span>
                </div>

                {/* Lesson Details */}
                <div className="space-y-1">
                  <h5 className="font-bold text-xs text-[#2C3E50] group-hover:text-[#E67E22] transition-colors leading-tight">
                    {rec.lesson.title}
                  </h5>
                  <p className="text-[11px] text-gray-500 line-clamp-1 font-sans">
                    {rec.lesson.subtitle || rec.unit.title}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-gray-200/50 flex justify-between items-center">
                <span className="text-[10px] text-gray-400 font-sans">
                  {completedLessons.includes(rec.lesson.id) ? "مقروء ✓" : "بانتظار الدراسة 📖"}
                </span>

                <button
                  onClick={() => onNavigateToLesson(rec.lesson.id)}
                  className="text-xs font-bold text-[#2C3E50] hover:text-[#E67E22] flex items-center gap-1.5 transition-colors font-sans"
                >
                  افتح مراجعة الدرس
                  <ChevronLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recommended general actions */}
      <div className="bg-[#2C3E50]/5 p-4 rounded border border-[#2C3E50]/10 flex flex-col sm:flex-row justify-between items-center gap-3 text-right">
        <div className="space-y-1">
          <span className="text-xs font-bold text-[#2C3E50] block font-sans">هل تريد قياس مستوى تمكنك بمزيد من الاختبارات؟</span>
          <p className="text-[11px] text-[#7F8C8D] font-sans">اختبر ذكاءك ومستواك بشكل شامل وسجل أداءك ليتمكن النظام من تصويب نقاط الضعف بدقة أعلى.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => activeTabSetter("quiz")}
            className="px-3.5 py-1.5 bg-[#2C3E50] hover:bg-[#1A252F] text-white text-xs font-bold font-sans rounded transition-all shadow-xs"
          >
            الذهاب للاختبارات 📝
          </button>
          <button
            onClick={() => activeTabSetter("worksheets")}
            className="px-3.5 py-1.5 bg-white hover:bg-gray-50 text-[#2C3E50] text-xs font-bold font-sans rounded border border-gray-300 transition-all shadow-xs"
          >
            توليد أوراق عمل تفاعلية 🧪
          </button>
        </div>
      </div>

    </div>
  );
};
