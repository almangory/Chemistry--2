import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { curriculumData } from "../data/curriculum";
import { generateQuizQuestions } from "../utils/quizGenerator";
import { 
  Check, 
  X, 
  Award, 
  HelpCircle, 
  ChevronLeft, 
  RotateCcw, 
  Sliders, 
  Heart, 
  Layers, 
  BookOpen, 
  Sparkles,
  ArrowRight
} from "lucide-react";
import { QuizQuestion } from "../types";

interface QuizViewProps {
  quizScores: Record<string, number>;
  onSaveScore: (unitId: string, score: number) => void;
  favoriteLessons?: string[];
}

export const QuizView: React.FC<QuizViewProps> = ({
  quizScores,
  onSaveScore,
  favoriteLessons = []
}) => {
  // Configuration States
  const [isConfiguring, setIsConfiguring] = useState<boolean>(true);
  const [selectedScope, setSelectedScope] = useState<"unit" | "lesson" | "favorites">("unit");
  const [selectedUnitId, setSelectedUnitId] = useState<string>("1");
  const [selectedLessonId, setSelectedLessonId] = useState<string>("");
  const [requestedCount, setRequestedCount] = useState<number>(10);

  // Active Quiz States
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIdx, setCurrentStepIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  // Automatically update selectedLessonId when unit changes
  useEffect(() => {
    const unit = curriculumData.find((u) => u.id === selectedUnitId);
    if (unit && unit.lessons.length > 0) {
      setSelectedLessonId(unit.lessons[0].id);
    }
  }, [selectedUnitId]);

  const activeUnit = curriculumData.find((u) => u.id === selectedUnitId) || curriculumData[0];
  const activeLesson = activeUnit.lessons.find((l) => l.id === selectedLessonId) || activeUnit.lessons[0];

  // Start the custom quiz
  const handleStartQuiz = () => {
    const generated = generateQuizQuestions(
      selectedUnitId,
      selectedLessonId,
      selectedScope,
      favoriteLessons,
      requestedCount
    );

    if (generated.length === 0) {
      // Avoid starting an empty quiz
      return;
    }

    setQuestions(generated);
    setCurrentStepIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setCorrectCount(0);
    setQuizFinished(false);
    setIsConfiguring(false);
  };

  const handleOptionClick = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === questions[currentQuestionIdx].correctAnswer) {
      setCorrectCount((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentStepIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Calculate final score percent
      const finalPercent = Math.round((correctCount / questions.length) * 100);
      // Save score to corresponding unit
      onSaveScore(selectedUnitId, finalPercent);
      setQuizFinished(true);
    }
  };

  const handleReset = () => {
    setCurrentStepIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setCorrectCount(0);
    setQuizFinished(false);
  };

  const handleReturnToSetup = () => {
    setIsConfiguring(true);
    setQuizFinished(false);
  };

  const activeQuestion = questions[currentQuestionIdx];

  // Count how many questions exist in favorites
  const favoriteQuestionsCount = favoriteLessons.length > 0 ? 15 : 0; // estimate for visuals

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {isConfiguring ? (
          <motion.div
            key="quiz-config"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-3xl mx-auto bg-white border border-[#E5E2DE] p-6 md:p-8 rounded shadow-sm text-right space-y-8"
          >
            {/* Header */}
            <div className="border-b border-[#E5E2DE] pb-5 text-right space-y-2">
              <div className="flex justify-between items-center flex-row-reverse">
                <div className="bg-[#E67E22]/10 text-[#E67E22] p-2 rounded-full">
                  <Sliders className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-serif font-bold text-[#2C3E50] flex items-center gap-2 flex-row-reverse">
                  <span>تخصيص الامتحان والتقييم الذكي</span>
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </h2>
              </div>
              <p className="text-xs text-[#7F8C8D] leading-relaxed font-sans">
                اختر نوع الامتحان، حدد نطاق الأسئلة، واختر الطول المناسب للاختبار لتحدي معلوماتك الكيميائية في المنهج السوداني دون تكرار للأسئلة.
              </p>
            </div>

            {/* Scope Tabs Selector */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-[#2C3E50] font-sans">1. نطاق الامتحان والأسئلة:</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Unit Scope */}
                <button
                  type="button"
                  onClick={() => setSelectedScope("unit")}
                  className={`p-4 rounded border-2 text-right transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                    selectedScope === "unit"
                      ? "bg-amber-50/50 border-[#E67E22] text-[#2C3E50]"
                      : "bg-white border-[#E5E2DE] text-[#7F8C8D] hover:bg-[#F9F8F6]"
                  }`}
                >
                  <div className="flex items-center justify-between w-full flex-row-reverse">
                    <Layers className={`w-5 h-5 ${selectedScope === "unit" ? "text-[#E67E22]" : "text-[#95A5A6]"}`} />
                    <span className="text-xs font-bold font-sans">امتحان وحدة كاملة</span>
                  </div>
                  <span className="text-[10px] opacity-85 leading-relaxed font-sans block mt-1">
                    شامل لجميع دروس وفصول وحدة دراسية معينة من المنهج.
                  </span>
                </button>

                {/* Lesson Scope */}
                <button
                  type="button"
                  onClick={() => setSelectedScope("lesson")}
                  className={`p-4 rounded border-2 text-right transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                    selectedScope === "lesson"
                      ? "bg-amber-50/50 border-[#E67E22] text-[#2C3E50]"
                      : "bg-white border-[#E5E2DE] text-[#7F8C8D] hover:bg-[#F9F8F6]"
                  }`}
                >
                  <div className="flex items-center justify-between w-full flex-row-reverse">
                    <BookOpen className={`w-5 h-5 ${selectedScope === "lesson" ? "text-[#E67E22]" : "text-[#95A5A6]"}`} />
                    <span className="text-xs font-bold font-sans">امتحان درس معين</span>
                  </div>
                  <span className="text-[10px] opacity-85 leading-relaxed font-sans block mt-1">
                    تقييم دقيق ومركّز لدرس واحد فقط لتثبيت فهمه بشكل ممتاز.
                  </span>
                </button>

                {/* Favorites Scope */}
                <button
                  type="button"
                  onClick={() => setSelectedScope("favorites")}
                  className={`p-4 rounded border-2 text-right transition-all flex flex-col justify-between gap-2 cursor-pointer relative ${
                    selectedScope === "favorites"
                      ? "bg-amber-50/50 border-[#E67E22] text-[#2C3E50]"
                      : "bg-white border-[#E5E2DE] text-[#7F8C8D] hover:bg-[#F9F8F6]"
                  }`}
                >
                  <div className="flex items-center justify-between w-full flex-row-reverse">
                    <Heart className={`w-5 h-5 ${selectedScope === "favorites" ? "text-red-500 fill-red-500" : "text-[#95A5A6]"}`} />
                    <span className="text-xs font-bold font-sans">الدروس المفضلة</span>
                  </div>
                  <span className="text-[10px] opacity-85 leading-relaxed font-sans block mt-1">
                    توليد أسئلة مخصصة فقط من قائمة الدروس التي قمت بتفضيلها.
                  </span>
                  {favoriteLessons.length > 0 && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                      {favoriteLessons.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Parameters Selection */}
            <div className="space-y-4 pt-2">
              {/* Unit & Lesson selectors */}
              {selectedScope !== "favorites" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Unit Selector */}
                  <div className="space-y-1.5 text-right">
                    <label className="block text-xs font-bold text-[#2C3E50] font-sans">الوحدة الدراسية:</label>
                    <select
                      value={selectedUnitId}
                      onChange={(e) => setSelectedUnitId(e.target.value)}
                      className="w-full bg-[#F9F8F6] border border-[#E5E2DE] rounded p-2.5 text-xs text-[#2C3E50] focus:ring-1 focus:ring-[#E67E22] outline-none text-right font-sans font-semibold"
                    >
                      {curriculumData.map((unit) => (
                        <option key={unit.id} value={unit.id}>
                          الوحدة {unit.number}: {unit.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Lesson Selector (Only for Lesson scope) */}
                  {selectedScope === "lesson" && (
                    <div className="space-y-1.5 text-right">
                      <label className="block text-xs font-bold text-[#2C3E50] font-sans">الدرس المستهدف:</label>
                      <select
                        value={selectedLessonId}
                        onChange={(e) => setSelectedLessonId(e.target.value)}
                        className="w-full bg-[#F9F8F6] border border-[#E5E2DE] rounded p-2.5 text-xs text-[#2C3E50] focus:ring-1 focus:ring-[#E67E22] outline-none text-right font-sans font-semibold"
                      >
                        {activeUnit.lessons.map((lesson) => (
                          <option key={lesson.id} value={lesson.id}>
                            {lesson.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}

              {/* Favorites alert/warning if empty */}
              {selectedScope === "favorites" && favoriteLessons.length === 0 && (
                <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded text-right leading-relaxed font-sans">
                  ⚠️ <strong>لا توجد دروس مفضلة حالياً:</strong> يمكنك تفضيل الدروس من خلال علامة النجمة بصفحة المنهج (الكتاب الإلكتروني)، لنتمكن من توليد أسئلة مخصصة لك من فصولك المفضلة كلياً.
                </div>
              )}
            </div>

            {/* Questions count selector */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center flex-row-reverse">
                <label className="text-xs font-bold text-[#2C3E50] font-sans">2. عدد أسئلة الامتحان:</label>
                <span className="text-xs font-mono font-bold text-[#E67E22] bg-[#E67E22]/10 px-2 py-0.5 rounded">
                  {requestedCount} سؤالاً
                </span>
              </div>
              
              {/* Grid of quick choices */}
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {[5, 10, 15, 20, 25, 30].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setRequestedCount(num)}
                    className={`py-2 rounded border text-xs font-bold font-mono transition-all ${
                      requestedCount === num
                        ? "bg-[#E67E22] border-[#E67E22] text-white shadow-sm"
                        : "bg-white border-[#E5E2DE] text-[#7F8C8D] hover:bg-[#F9F8F6]"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <span className="block text-[10px] text-[#95A5A6] font-sans text-right">
                * الحد الأقصى المسموح به هو 30 سؤالاً لضمان تجربة تقييم متوازنة وعالية التركيز.
              </span>
            </div>

            {/* Start Button */}
            <div className="pt-4 border-t border-[#E5E2DE] flex justify-end">
              <button
                type="button"
                disabled={selectedScope === "favorites" && favoriteLessons.length === 0}
                onClick={handleStartQuiz}
                className={`px-8 py-3 rounded text-xs font-bold font-sans transition-all flex items-center gap-2 flex-row-reverse shadow-md ${
                  selectedScope === "favorites" && favoriteLessons.length === 0
                    ? "bg-[#F9F8F6] text-[#95A5A6] border border-[#E5E2DE] cursor-not-allowed shadow-none"
                    : "bg-[#2C3E50] hover:bg-[#1A252F] text-white hover:scale-[1.02]"
                }`}
              >
                <span>ابدأ الامتحان المخصص الآن</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="quiz-active"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="max-w-3xl mx-auto bg-white border border-[#E5E2DE] p-6 md:p-8 rounded shadow-sm text-right"
          >
            {!quizFinished ? (
              <div className="space-y-6">
                {/* Question progress */}
                <div className="flex justify-between items-center border-b border-[#E5E2DE] pb-4">
                  <div className="text-xs text-[#7F8C8D] font-mono font-bold">
                    SCORE: {correctCount}/{questions.length}
                  </div>
                  <div className="text-right space-y-1">
                    <span className="text-[10px] bg-[#E67E22] text-white px-2 py-0.5 rounded-sm font-bold uppercase font-mono">
                      سؤال {currentQuestionIdx + 1} من {questions.length}
                    </span>
                    <h3 className="text-xs text-[#7F8C8D] font-sans mt-1">
                      {selectedScope === "unit" && `امتحان تقييم: الوحدة ${activeUnit.number}`}
                      {selectedScope === "lesson" && `امتحان درس: ${activeLesson.title}`}
                      {selectedScope === "favorites" && "امتحان الدروس المفضلة المخصصة"}
                    </h3>
                  </div>
                </div>

                {/* Question Text */}
                <div className="p-5 bg-[#F9F8F6] rounded border border-[#E5E2DE]">
                  <p className="text-sm font-bold text-[#1A1A1A] leading-relaxed font-sans">
                    {activeQuestion?.question}
                  </p>
                </div>

                {/* Option cards */}
                <div className="space-y-3">
                  {activeQuestion?.options.map((option, idx) => {
                    const isCorrect = idx === activeQuestion.correctAnswer;
                    const isSelected = idx === selectedOption;
                    
                    let optionStyle = "bg-[#F9F8F6] border-[#E5E2DE] text-[#2C3E50] hover:bg-[#E5E2DE]/30";
                    if (isAnswered) {
                      if (isCorrect) {
                        optionStyle = "bg-emerald-50 border-emerald-500 text-emerald-800";
                      } else if (isSelected) {
                        optionStyle = "bg-red-50 border-red-500 text-red-800";
                      } else {
                        optionStyle = "bg-[#F9F8F6] border-[#E5E2DE] text-[#95A5A6] opacity-60";
                      }
                    }

                    return (
                      <div
                        key={idx}
                        onClick={() => handleOptionClick(idx)}
                        className={`p-4 rounded border-2 cursor-pointer transition-all flex gap-3 items-center justify-between ${optionStyle}`}
                      >
                        {/* Left icon feedback */}
                        <div className="shrink-0 flex items-center">
                          {isAnswered && isCorrect && <Check className="w-4 h-4 text-emerald-600 font-bold" />}
                          {isAnswered && isSelected && !isCorrect && <X className="w-4 h-4 text-red-600 font-bold" />}
                          {!isAnswered && (
                            <span className="w-5 h-5 rounded-full border border-[#E5E2DE] text-[10px] font-bold text-[#7F8C8D] flex items-center justify-center font-mono bg-white shadow-sm">
                              {idx + 1}
                            </span>
                          )}
                        </div>

                        {/* Right option text */}
                        <span className="text-xs font-semibold font-sans flex-1 text-right">{option}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Explanations block */}
                {isAnswered && activeQuestion && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-4 bg-[#F9F8F6] border-r-4 border-[#E67E22] rounded space-y-1.5"
                  >
                    <div className="flex items-center gap-1.5 justify-end">
                      <span className="font-bold text-xs text-[#E67E22] font-sans">الشرح والإجابة النموذجية:</span>
                      <HelpCircle className="w-4 h-4 text-[#E67E22]" />
                    </div>
                    <p className="text-xs text-[#7F8C8D] leading-relaxed font-sans">{activeQuestion.explanation}</p>
                  </motion.div>
                )}

                {/* Button container */}
                <div className="flex justify-between items-center pt-4 border-t border-[#E5E2DE] flex-row-reverse">
                  <button
                    disabled={!isAnswered}
                    onClick={handleNext}
                    className={`px-6 py-2.5 rounded text-xs font-bold font-sans transition-all flex items-center gap-1.5 flex-row-reverse ${
                      isAnswered
                        ? "bg-[#E67E22] text-white hover:bg-[#d6721b] shadow-sm"
                        : "bg-[#F9F8F6] text-[#95A5A6] border border-[#E5E2DE] cursor-not-allowed"
                    }`}
                  >
                    <span>
                      {currentQuestionIdx === questions.length - 1 ? "إرسال النتائج ورؤية النتيجة" : "السؤال التالي"}
                    </span>
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleReturnToSetup}
                    className="text-xs text-[#7F8C8D] hover:text-[#2C3E50] font-sans font-semibold flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>إلغاء والعودة للتهيئة</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-4xl shadow-lg mx-auto">
                  🏆
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-emerald-600 font-bold block uppercase font-mono">EXAM COMPLETED</span>
                  <h3 className="text-xl md:text-2xl font-serif font-bold text-[#2C3E50]">تهانينا الحارة! لقد أكملت الاختبار</h3>
                  <p className="text-xs text-[#7F8C8D] max-w-sm mx-auto mt-1">
                    لقد أنجزت بنجاح امتحان التقييم المخصص في الكيمياء للمنهج السوداني.
                  </p>
                </div>

                {/* Score card */}
                <div className="p-6 bg-[#F9F8F6] rounded border border-[#E5E2DE] inline-block min-w-56 space-y-2 shadow-sm">
                  <span className="text-xs text-[#7F8C8D] block font-sans">علامتك النهائية المستحقة:</span>
                  <span className="text-4xl font-serif font-bold text-emerald-600 font-mono">
                    {Math.round((correctCount / questions.length) * 100)}%
                  </span>
                  <span className="text-xs text-[#95A5A6] block">({correctCount} إجابات صحيحة من أصل {questions.length})</span>
                </div>

                {/* Certificate of mastery badge */}
                {Math.round((correctCount / questions.length) * 100) >= 80 ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded max-w-md mx-auto text-right flex gap-3 items-center shadow-sm">
                    <div className="flex-1 space-y-1">
                      <span className="font-bold text-xs text-emerald-700 block font-sans">مبارك! لقد حصلت على وسام كفاءة المنهج</span>
                      <p className="text-[11px] text-[#7F8C8D] leading-relaxed font-sans">
                        لحصولك على علامة تزيد عن 80%، تم تسجيل كفاءتك العالية بنجاح في لوحة الميداليات الكيميائية الخاصة بك!
                      </p>
                    </div>
                    <Award className="w-8 h-8 text-emerald-600 shrink-0" />
                  </div>
                ) : (
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded max-w-md mx-auto text-right flex gap-3 items-center shadow-sm">
                    <div className="flex-1 space-y-1">
                      <span className="font-bold text-xs text-[#E67E22] block font-sans">هل تريد تحسين درجاتك؟</span>
                      <p className="text-[11px] text-[#7F8C8D] leading-relaxed font-sans">
                        تحتاج لعلامة 80% أو أكثر لتأهيل الأوسمة الكيميائية. تصفح ملخص المنهج وأعد الاختبار لتزيد درجاتك.
                      </p>
                    </div>
                    <RotateCcw className="w-6 h-6 text-[#E67E22] shrink-0" />
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-3 justify-center border-t border-[#E5E2DE] pt-6">
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-white hover:bg-[#F9F8F6] text-[#2C3E50] border border-[#E5E2DE] font-bold rounded text-xs transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <RotateCcw className="w-4 h-4" />
                    أعد الاختبار بنفس الإعدادات
                  </button>
                  <button
                    onClick={handleReturnToSetup}
                    className="px-4 py-2 bg-[#E67E22] hover:bg-[#d6721b] text-white font-bold rounded text-xs transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    عودة لتهيئة امتحان جديد
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
