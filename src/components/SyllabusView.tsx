import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { curriculumData } from "../data/curriculum";
import { InteractiveDiagram } from "./InteractiveDiagram";
import { BookOpen, CheckSquare, Award, AlertCircle, ChevronDown, Check, FlaskConical, Heart, Maximize2, Minimize2 } from "lucide-react";
import { Unit, Lesson } from "../types";
import syllabusBannerImg from "../assets/images/chemistry_syllabus_banner_1783119129428.jpg";

interface SyllabusViewProps {
  completedLessons: string[];
  toggleLessonComplete: (lessonId: string) => void;
  favoriteLessons?: string[];
  toggleLessonFavorite?: (lessonId: string) => void;
  onNavigateToLab: (lessonId: string) => void;
  selectedLessonId?: string | null;
  setSelectedLessonId?: (lessonId: string | null) => void;
  isFocusReading?: boolean;
  setIsFocusReading?: (val: boolean) => void;
}

export const SyllabusView: React.FC<SyllabusViewProps> = ({
  completedLessons,
  toggleLessonComplete,
  favoriteLessons = [],
  toggleLessonFavorite,
  onNavigateToLab,
  selectedLessonId,
  setSelectedLessonId,
  isFocusReading = false,
  setIsFocusReading
}) => {
  const [selectedUnit, setSelectedUnit] = useState<Unit>(curriculumData[0]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson>(curriculumData[0].lessons[0]);

  useEffect(() => {
    if (selectedLessonId && setSelectedLessonId) {
      // Find the unit containing this lesson
      const unit = curriculumData.find((u) => u.lessons.some((l) => l.id === selectedLessonId));
      if (unit) {
        setSelectedUnit(unit);
        const lesson = unit.lessons.find((l) => l.id === selectedLessonId);
        if (lesson) {
          setSelectedLesson(lesson);
          setShowSummary(false);
        }
      }
      // Reset external selection so it doesn't lock manual navigations
      setSelectedLessonId(null);
    }
  }, [selectedLessonId, setSelectedLessonId]);
  const [showSummary, setShowSummary] = useState<boolean>(false);
  
  // Custom dropdown open states
  const [unitDropdownOpen, setUnitDropdownOpen] = useState<boolean>(false);
  const [lessonDropdownOpen, setLessonDropdownOpen] = useState<boolean>(false);

  const selectUnit = (unit: Unit) => {
    setSelectedUnit(unit);
    setSelectedLesson(unit.lessons[0]);
    setShowSummary(false);
  };

  const isLessonRead = completedLessons.includes(selectedLesson.id);
  const isLessonFavorite = favoriteLessons.includes(selectedLesson.id);

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Premium Chemistry Syllabus Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-[#E5E2DE] shadow-md h-48 md:h-60 flex items-center bg-[#1E293B]">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={syllabusBannerImg}
            alt="منهج الكيمياء للصف الثاني الثانوي"
            className="w-full h-full object-cover opacity-80 select-none pointer-events-none filter brightness-90 saturate-110"
            referrerPolicy="no-referrer"
          />
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-l from-slate-950/90 via-slate-900/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent" />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 p-6 md:p-8 flex flex-col justify-center items-start text-right w-full h-full text-white">
          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-[10px] md:text-xs font-bold font-sans flex items-center gap-1.5 shadow-sm mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            منهج الكيمياء التفاعلي • جمهورية السودان
          </span>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-serif font-bold tracking-tight text-white mb-2 md:mb-3 drop-shadow-md">
            كيمياء الصف الثاني الثانوي
          </h1>
          <p className="text-[11px] md:text-xs lg:text-sm text-slate-300 max-w-xl leading-relaxed drop-shadow-sm font-sans">
            رحلة استكشاف مجهرية وتفاعلية في بنية الذرة، والجدول الدوري، وعناصر المجموعتين الأولى والثانية، والروابط الكيميائية، والكيمياء العضوية.
          </p>
        </div>
      </div>

      {/* Top Navigation Row: Dual Custom Dropdowns */}
      <div className="bg-[#F9F8F6] border border-[#E5E2DE] p-4 rounded-lg flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between shadow-sm relative z-30">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          
          {/* Unit Custom Dropdown */}
          <div className="relative flex-1 text-right">
            <label className="block text-xs font-bold text-[#7F8C8D] mb-1.5 font-sans">الوحدة الدراسية:</label>
            <button
              onClick={() => {
                setUnitDropdownOpen(!unitDropdownOpen);
                setLessonDropdownOpen(false);
              }}
              className="w-full bg-white border border-[#E5E2DE] hover:border-[#2C3E50] rounded px-4 py-2.5 text-right flex items-center justify-between gap-2 shadow-sm transition-all text-xs font-bold text-[#2C3E50]"
            >
              <ChevronDown className={`w-4 h-4 text-[#7F8C8D] transition-transform ${unitDropdownOpen ? 'rotate-180' : ''}`} />
              <div className="flex items-center gap-2 min-w-0">
                <span className="truncate">{selectedUnit.title}</span>
                <span className="bg-[#2C3E50]/10 text-[#2C3E50] px-2 py-0.5 rounded text-[10px] font-mono shrink-0">الوحدة {selectedUnit.number}</span>
              </div>
            </button>
            
            {/* Options List */}
            <AnimatePresence>
              {unitDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setUnitDropdownOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute right-0 left-0 mt-1 bg-white border border-[#E5E2DE] rounded-md shadow-lg z-30 max-h-60 overflow-y-auto"
                  >
                    {curriculumData.map((unit) => (
                      <button
                        key={unit.id}
                        onClick={() => {
                          selectUnit(unit);
                          setUnitDropdownOpen(false);
                        }}
                        className={`w-full text-right px-4 py-2.5 text-xs hover:bg-[#F9F8F6] flex items-center justify-between gap-2 border-b border-[#F5F4F0] last:border-b-0 transition-colors ${
                          selectedUnit.id === unit.id ? "bg-[#F9F8F6] text-[#E67E22] font-bold" : "text-[#2C3E50]"
                        }`}
                      >
                        <span className="text-[10px] text-[#7F8C8D]">الوحدة {unit.number}</span>
                        <span className="font-sans truncate">{unit.title}</span>
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Lesson Custom Dropdown */}
          <div className="relative flex-1 text-right">
            <label className="block text-xs font-bold text-[#7F8C8D] mb-1.5 font-sans">درس الوحدة المحدد:</label>
            <button
              onClick={() => {
                setLessonDropdownOpen(!lessonDropdownOpen);
                setUnitDropdownOpen(false);
              }}
              className="w-full bg-white border border-[#E5E2DE] hover:border-[#E67E22] rounded px-4 py-2.5 text-right flex items-center justify-between gap-2 shadow-sm transition-all text-xs font-bold text-[#2C3E50]"
            >
              <ChevronDown className={`w-4 h-4 text-[#7F8C8D] transition-transform ${lessonDropdownOpen ? 'rotate-180' : ''}`} />
              <div className="flex items-center gap-2 min-w-0">
                <span className="truncate">{selectedLesson.title}</span>
                {completedLessons.includes(selectedLesson.id) ? (
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] shrink-0 font-sans">مكتمل ✓</span>
                ) : (
                  <span className="bg-orange-50 text-[#E67E22] border border-orange-100 px-2 py-0.5 rounded text-[10px] shrink-0 font-sans">قيد الدراسة</span>
                )}
              </div>
            </button>

            {/* Options List */}
            <AnimatePresence>
              {lessonDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setLessonDropdownOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute right-0 left-0 mt-1 bg-white border border-[#E5E2DE] rounded-md shadow-lg z-30 max-h-72 overflow-y-auto"
                  >
                    {selectedUnit.lessons.map((lesson) => {
                      const isRead = completedLessons.includes(lesson.id);
                      const isActive = selectedLesson.id === lesson.id;
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => {
                            setSelectedLesson(lesson);
                            setShowSummary(false);
                            setLessonDropdownOpen(false);
                          }}
                          className={`w-full text-right px-4 py-3 text-xs hover:bg-[#F9F8F6] flex items-center justify-between gap-4 border-b border-[#F5F4F0] last:border-b-0 transition-colors ${
                            isActive ? "bg-orange-50/40 text-[#E67E22] font-bold" : "text-[#2C3E50]"
                          }`}
                        >
                          <div className="flex items-center gap-1.5 shrink-0">
                            {isRead ? (
                              <span className="text-emerald-600 text-[10px] bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-bold font-sans">مكتمل ✓</span>
                            ) : (
                              <span className="text-[#7F8C8D] text-[10px] bg-[#F5F4F0] px-1.5 py-0.5 rounded font-sans">غير منجز</span>
                            )}
                          </div>
                          <div className="flex-1 text-right min-w-0 space-y-0.5">
                            <span className="font-sans block truncate">{lesson.title}</span>
                            {lesson.subtitle && (
                              <span className="block text-[10px] text-[#7F8C8D] truncate font-normal leading-normal">
                                {lesson.subtitle}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* Info/Guide Badge */}
        <div className="text-right border-r border-[#E5E2DE] pr-4 mr-0 md:mr-4 hidden lg:block max-w-xs shrink-0">
          <span className="text-[10px] text-[#95A5A6] font-bold tracking-widest font-mono block">CHEMISTRY CURRICULUM</span>
          <h4 className="text-xs font-bold text-[#2C3E50] mt-0.5">منهج كيمياء الصف الثاني الثانوي</h4>
          <p className="text-[10px] text-[#7F8C8D] mt-1 leading-normal">اختر الوحدة والدرس من القوائم للبدء بالتصفح والدراسة.</p>
        </div>
      </div>

      {/* Main Lesson Content Area - Expanded to full width */}
      <div className="bg-white border border-[#E5E2DE] p-6 md:p-8 rounded-lg space-y-6 shadow-sm w-full">
        {/* Header containing Actions and Lesson Titles */}
        <div className="border-b border-[#E5E2DE] pb-4 flex flex-col md:flex-row-reverse justify-between items-start md:items-center gap-4">
          <div className="text-right space-y-1">
            <span className="text-[10px] bg-[#2C3E50] text-white px-2 py-0.5 rounded-sm font-bold uppercase font-mono">
              الوحدة {selectedUnit.number} • الدرس {selectedUnit.lessons.indexOf(selectedLesson) + 1}
            </span>
            <h2 className="text-xl md:text-2xl font-serif font-bold text-[#2C3E50] tracking-tight">{selectedLesson.title}</h2>
            {selectedLesson.subtitle && (
              <p className="text-xs text-[#7F8C8D] font-sans">{selectedLesson.subtitle}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => toggleLessonComplete(selectedLesson.id)}
              className={`px-4 py-2 rounded text-xs font-bold font-sans transition-all flex items-center gap-1.5 ${
                isLessonRead
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-[#E67E22] text-white hover:bg-[#d6721b] shadow-sm"
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              {isLessonRead ? "إلغاء إنجاز الدرس" : "أكملت دراسة هذا الدرس ✓"}
            </button>
            <button
              onClick={() => toggleLessonFavorite && toggleLessonFavorite(selectedLesson.id)}
              className={`px-3 py-2 rounded text-xs font-bold font-sans transition-all flex items-center gap-1.5 ${
                isLessonFavorite
                  ? "bg-rose-50 text-rose-700 border border-rose-200"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              <Heart className={`w-4 h-4 ${isLessonFavorite ? "fill-rose-600 text-rose-600" : "text-gray-400"}`} />
              {isLessonFavorite ? "درس مفضل" : "إضافة للمفضلة"}
            </button>
            <button
              onClick={() => onNavigateToLab(selectedLesson.id)}
              className="px-3 py-2 bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 rounded text-xs font-bold font-sans transition-all flex items-center gap-1.5"
              title="تخطى مباشرة للمعمل التفاعلي لتجربة هذا الدرس"
            >
              <FlaskConical className="w-4 h-4 text-purple-600" />
              تجربة معملية تفاعلية 🧪
            </button>
            <button
              onClick={() => setShowSummary(!showSummary)}
              className={`px-3 py-2 rounded text-xs font-bold font-sans border transition-all ${
                showSummary
                  ? "bg-[#2C3E50] text-white border-[#2C3E50]"
                  : "bg-transparent text-[#2C3E50] border border-[#2C3E50] hover:bg-[#F9F8F6]"
              }`}
            >
              {showSummary ? "عرض الدرس كاملاً" : "عرض ملخص الدرس البصري"}
            </button>
            <button
              onClick={() => setIsFocusReading && setIsFocusReading(!isFocusReading)}
              className={`px-3 py-2 rounded text-xs font-bold font-sans transition-all flex items-center gap-1.5 ${
                isFocusReading
                  ? "bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900"
                  : "bg-orange-50 text-[#E67E22] border border-orange-200 hover:bg-orange-100/50"
              }`}
              title="تفعيل وضع ملء الشاشة لإخفاء القوائم الجانبية ومذاكرة مركزة"
            >
              {isFocusReading ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              {isFocusReading ? "إنهاء توسيع القراءة" : "توسيع القراءة 📖"}
            </button>
          </div>
        </div>

        {/* Focus Reading Mode Alert Banner */}
        {isFocusReading && (
          <div className="bg-amber-500/10 border-r-4 border-amber-500 p-3.5 rounded-lg flex items-center justify-between flex-row-reverse text-right transition-all animate-fadeIn">
            <div className="flex items-center gap-2 flex-row-reverse">
              <span className="text-amber-600 font-bold text-xs font-sans">وضع المذاكرة المركّزة مفعّل الآن</span>
              <span className="text-sm">🎯</span>
            </div>
            <p className="text-[11px] text-[#7F8C8D] hidden md:block">تم إخفاء القوائم الجانبية لتستمتع بمساحة قراءة أوسع خالية من المشتتات.</p>
            <button
              onClick={() => setIsFocusReading && setIsFocusReading(false)}
              className="px-2.5 py-1 bg-white hover:bg-amber-50 border border-amber-200 rounded text-[10px] font-bold text-amber-800 transition-all flex items-center gap-1 cursor-pointer"
            >
              <Minimize2 className="w-3 h-3" />
              إنهاء التركيز
            </button>
          </div>
        )}

        {/* Lesson Banner Image with descriptive components */}
        {selectedLesson.image && (
          <div className="overflow-hidden rounded border border-[#E5E2DE] shadow-sm bg-[#F9F8F6] transition-all duration-300 relative group max-h-96">
            <img
              src={selectedLesson.image}
              alt={selectedLesson.title}
              className="w-full object-cover max-h-96"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-0 right-0 left-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 text-right">
              <span className="text-xs text-orange-400 font-bold font-sans block">الشكل والتمثيل التوضيحي للدرس</span>
              <p className="text-white text-xs mt-1 leading-relaxed max-w-3xl">{selectedLesson.subtitle || selectedLesson.title}</p>
            </div>
          </div>
        )}

        {/* Lesson Main text OR Summary tab */}
        <AnimatePresence mode="wait">
          {!showSummary ? (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4 text-[#1A1A1A] leading-relaxed text-sm text-right"
            >
              {selectedLesson.content.map((para, idx) => (
                <p
                  key={idx}
                  className="font-sans"
                  dangerouslySetInnerHTML={{ __html: para }}
                />
              ))}

              {/* Render Explanatory Illustrations if defined */}
              {selectedLesson.illustrations && selectedLesson.illustrations.length > 0 && (
                <div className="border-t border-[#E5E2DE] pt-6 mt-6 space-y-6">
                  <div className="border-b border-[#E5E2DE] pb-2 mb-4">
                    <span className="text-xs text-[#95A5A6] font-bold tracking-widest font-mono">VISUAL EXPLANATIONS</span>
                    <h3 className="text-md font-serif font-bold text-[#2C3E50] mt-0.5">الرسومات والأشكال التوضيحية التفاعلية للدرس</h3>
                  </div>

                  {selectedLesson.illustrations.map((ill, idx) => (
                    <div key={idx} className="space-y-3">
                      <span className="font-bold text-sm text-[#E67E22] font-sans block">{ill.title}</span>
                      <p className="text-xs text-[#7F8C8D] leading-relaxed max-w-2xl ml-auto">{ill.description}</p>
                      <InteractiveDiagram type={ill.svgType} />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4 text-right"
            >
              <div className="bg-[#2C3E50]/5 border border-[#2C3E50]/15 p-4 rounded flex items-start gap-3 text-right">
                <div className="flex-1 space-y-1">
                  <span className="font-bold text-sm text-[#2C3E50] block font-sans">ملخص الدرس الشامل البصري للطلاب</span>
                  <p className="text-xs text-[#7F8C8D] leading-relaxed">
                    هذا ملخص مصمم لمراجعة المفاصل الكيميائية الدقيقة والنقاط الذهبية في الدرس بسرعة وكفاءة قبل الاختبارات التقييمية.
                  </p>
                </div>
                <AlertCircle className="w-5 h-5 text-[#2C3E50] shrink-0" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {selectedLesson.summary.map((point, idx) => (
                  <div key={idx} className="p-4 bg-[#F9F8F6] border border-[#E5E2DE] rounded space-y-2">
                    <div className="flex items-center gap-1.5 justify-end">
                      <span className="font-bold text-xs text-[#7F8C8D] font-sans">النقطة الذهبية {idx + 1}</span>
                      <Award className="w-4 h-4 text-[#E67E22]" />
                    </div>
                    <p className="text-xs text-[#1A1A1A] leading-relaxed font-sans">{point}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
