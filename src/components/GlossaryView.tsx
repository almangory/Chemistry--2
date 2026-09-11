import React, { useState } from "react";
import { glossaryTerms } from "../data/glossary";
import { chemicalElements, ChemicalElement } from "../data/elements";
import { FlashcardsView } from "./FlashcardsView";
import { 
  Search, 
  HelpCircle, 
  BookOpen, 
  Atom, 
  Flame, 
  Layers, 
  Beaker,
  Check,
  Sparkles,
  Info,
  Bookmark
} from "lucide-react";

export const GlossaryView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"terms" | "elements" | "flashcards">("terms");
  
  // Terms States
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedUnit, setSelectedUnit] = useState<string>("all");

  // Elements States
  const [elementSearch, setElementSearch] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedElement, setSelectedElement] = useState<ChemicalElement | null>(null);

  // Filter glossary terms
  const filteredTerms = glossaryTerms.filter((item) => {
    const matchesSearch =
      item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.englishTerm && item.englishTerm.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.definition.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesUnit = selectedUnit === "all" || item.unitId === selectedUnit;

    return matchesSearch && matchesUnit;
  });

  // Filter chemical elements
  const filteredElements = chemicalElements.filter((el) => {
    const matchesSearch =
      el.symbol.toLowerCase().includes(elementSearch.toLowerCase()) ||
      el.nameAr.toLowerCase().includes(elementSearch.toLowerCase()) ||
      el.nameEn.toLowerCase().includes(elementSearch.toLowerCase()) ||
      el.description.toLowerCase().includes(elementSearch.toLowerCase()) ||
      el.reactions.some(rx => 
        rx.equation.toLowerCase().includes(elementSearch.toLowerCase()) ||
        rx.reactants.toLowerCase().includes(elementSearch.toLowerCase()) ||
        rx.products.toLowerCase().includes(elementSearch.toLowerCase()) ||
        rx.description.toLowerCase().includes(elementSearch.toLowerCase())
      );

    const matchesCategory = selectedCategory === "all" || el.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Set default selected element if none selected or if active element filtered out
  const displayedElements = filteredElements;
  const currentElement = selectedElement && displayedElements.includes(selectedElement)
    ? selectedElement
    : displayedElements[0] || null;

  return (
    <div className="space-y-6">
      {/* Tab Navigation switcher */}
      <div className="flex border-b border-[#E5E2DE] dark:border-slate-800 justify-center md:justify-start gap-1 flex-row-reverse">
        <button
          onClick={() => setActiveTab("terms")}
          className={`px-5 py-3 text-xs font-bold font-sans transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
            activeTab === "terms"
              ? "border-[#E67E22] text-[#E67E22] bg-[#E67E22]/5 dark:bg-[#E67E22]/10"
              : "border-transparent text-[#7F8C8D] dark:text-slate-400 hover:text-[#2C3E50] dark:hover:text-slate-200"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>قاموس المصطلحات العلمية</span>
        </button>
        <button
          onClick={() => setActiveTab("elements")}
          className={`px-5 py-3 text-xs font-bold font-sans transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
            activeTab === "elements"
              ? "border-[#E67E22] text-[#E67E22] bg-[#E67E22]/5 dark:bg-[#E67E22]/10"
              : "border-transparent text-[#7F8C8D] dark:text-slate-400 hover:text-[#2C3E50] dark:hover:text-slate-200"
          }`}
        >
          <Atom className="w-4 h-4" />
          <span>رموز وتفاعلات العناصر الكيميائية</span>
          <span className="bg-[#E67E22] text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold">جديد</span>
        </button>
        <button
          onClick={() => setActiveTab("flashcards")}
          className={`px-5 py-3 text-xs font-bold font-sans transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
            activeTab === "flashcards"
              ? "border-[#E67E22] text-[#E67E22] bg-[#E67E22]/5 dark:bg-[#E67E22]/10"
              : "border-transparent text-[#7F8C8D] dark:text-slate-400 hover:text-[#2C3E50] dark:hover:text-slate-200"
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>البطاقات التعليمية للمذاكرة</span>
          <span className="bg-emerald-600 text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold">نشط</span>
        </button>
      </div>

      {/* Render terms tab */}
      {activeTab === "terms" && (
        <div className="space-y-6">
          {/* Search and Filters Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Unit select dropdown */}
            <div className="relative">
              <select
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-[#E5E2DE] dark:border-slate-800 text-[#2C3E50] dark:text-slate-100 px-4 py-3.5 rounded text-xs font-bold text-right focus:outline-none focus:border-[#E67E22] appearance-none cursor-pointer shadow-sm"
              >
                <option value="all">جميع فصول ومنهج الوحدات</option>
                <option value="1">الوحدة الأولى: الترتيب الدوري للعناصر</option>
                <option value="2">الوحدة الثانية: فلزات الأقلاء</option>
                <option value="3">الوحدة الثالثة: الكيمياء العضوية</option>
                <option value="4">الوحدة الرابعة: النيتروجين والغازات</option>
                <option value="5">الوحدة الخامسة: الهالوجينات</option>
                <option value="6">الوحدة السادسة: العناصر الانتقالية</option>
              </select>
            </div>

            {/* Search bar input */}
            <div className="md:col-span-2 relative">
              <input
                type="text"
                placeholder="ابحث عن مصطلح علمي، تعريف كيميائي، أو كلمة باللاتينية..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-[#E5E2DE] dark:border-slate-800 text-[#1A1A1A] dark:text-slate-100 px-4 py-3.5 pl-12 rounded text-xs text-right focus:outline-none focus:border-[#E67E22] font-sans shadow-sm"
              />
              <Search className="w-5 h-5 text-[#95A5A6] dark:text-slate-400 absolute left-4 top-3.5" />
            </div>
          </div>

          {/* Grid cabinet representing terms */}
          {filteredTerms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTerms.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 bg-white border border-[#E5E2DE] rounded text-right flex flex-col justify-between shadow-sm hover:shadow transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex justify-between items-center gap-2 border-b border-[#E5E2DE] pb-2">
                      <span className="text-[10px] bg-[#F9F8F6] text-[#7F8C8D] border border-[#E5E2DE] px-2 py-0.5 rounded font-mono font-bold">
                        الوحدة {item.unitId}
                      </span>
                      <div className="flex items-center gap-2">
                        {item.englishTerm && (
                          <span className="text-[11px] text-[#7F8C8D] font-mono font-medium">({item.englishTerm})</span>
                        )}
                        <h4 className="text-sm font-bold text-[#2C3E50] font-sans">{item.term}</h4>
                      </div>
                    </div>
                    <p className="text-xs text-[#1A1A1A] leading-relaxed font-sans mt-2">{item.definition}</p>
                  </div>

                  <div className="flex justify-end items-center gap-1.5 pt-2 border-t border-[#E5E2DE] mt-3">
                    <span className="text-[10px] text-[#95A5A6] font-bold font-mono">CHEM-GLOSSARY • SUDAN SYLLABUS</span>
                    <BookOpen className="w-3.5 h-3.5 text-[#95A5A6]" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 bg-[#F9F8F6] border border-[#E5E2DE] rounded text-center space-y-3 shadow-sm">
              <HelpCircle className="w-12 h-12 text-[#BDC3C7] mx-auto" />
              <p className="text-sm font-bold text-[#2C3E50]">عذراً، لم نجد أي مصطلحات تطابق بحثك</p>
              <p className="text-xs text-[#7F8C8D] max-w-md mx-auto leading-relaxed">
                تأكد من كتابة أحرف الكلمة أو المصطلح الكيميائي بشكل دقيق باللغة العربية أو الإنجليزية. يمكنك تصفية البحث حسب الوحدة لتبسيط النتائج.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Render element symbols & reactions DB tab */}
      {activeTab === "elements" && (
        <div className="space-y-6">
          {/* Header intro */}
          <div className="bg-amber-50/55 border border-[#E5E2DE] p-4 rounded text-right space-y-1.5">
            <h3 className="text-xs font-bold text-[#E67E22] flex items-center gap-1.5 flex-row-reverse font-sans">
              <Sparkles className="w-4 h-4 text-[#E67E22]" />
              <span>قاعدة بيانات العناصر وتفاعلاتها المقررة</span>
            </h3>
            <p className="text-[11px] text-[#7F8C8D] leading-relaxed font-sans">
              مكتبة كيميائية تفاعلية سريعة تتيح لك تصفح واستكشاف رموز العناصر، أعدادها الذرية، تصنيفاتها في مجموعات الجدول الدوري السوداني، والأهم من ذلك: معادلات تفاعلاتها الأساسية متزنة بالتفصيل مع تفسيرها العلمي.
            </p>
          </div>

          {/* Quick search and filters row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Category Select */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-white border border-[#E5E2DE] text-[#2C3E50] px-4 py-3.5 rounded text-xs font-bold text-right focus:outline-none focus:border-[#E67E22] appearance-none cursor-pointer shadow-sm"
              >
                <option value="all">جميع عوائل وتصنيفات العناصر</option>
                <option value="alkali">فلزات الأقلاء (المجموعة الأولى)</option>
                <option value="halogen">الهالوجينات (المجموعة السابعة عشر)</option>
                <option value="transition">العناصر الانتقالية الرئيسية (الفئة d)</option>
                <option value="nonmetal">اللافلزات النشطة (النيتروجين، الفوسفور)</option>
                <option value="noble">الغازات النبيلة / الخاملة</option>
                <option value="other">تصنيفات أخرى (الكالسيوم)</option>
              </select>
            </div>

            {/* Quick search bar for elements */}
            <div className="md:col-span-2 relative">
              <input
                type="text"
                placeholder="ابحث بالرمز (Na)، بالاسم (كلور)، أو بمعادلة كيميائية (H2O)..."
                value={elementSearch}
                onChange={(e) => setElementSearch(e.target.value)}
                className="w-full bg-white border border-[#E5E2DE] text-[#1A1A1A] px-4 py-3.5 pl-12 rounded text-xs text-right focus:outline-none focus:border-[#E67E22] font-sans shadow-sm"
              />
              <Search className="w-5 h-5 text-[#95A5A6] absolute left-4 top-3.5" />
            </div>
          </div>

          {/* Two column interactive view: Left list - Right Details */}
          {displayedElements.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Right: Selected element details panel (Occupies 7 cols on desktop) */}
              <div className="lg:col-span-7 space-y-4 order-1 lg:order-2">
                {currentElement ? (
                  <div className="bg-white border border-[#E5E2DE] rounded p-6 shadow-sm space-y-6 text-right">
                    
                    {/* Upper layout: big symbol badge & metadata */}
                    <div className="flex justify-between items-start flex-row-reverse border-b border-[#E5E2DE] pb-5">
                      <div className="flex gap-4 items-center flex-row-reverse">
                        <div className="w-20 h-20 bg-slate-900 text-amber-400 font-mono text-3xl font-bold rounded-lg flex flex-col justify-center items-center shadow-md select-all">
                          <span>{currentElement.symbol}</span>
                          <span className="text-[10px] text-slate-400 font-sans tracking-tight font-medium mt-1">Z = {currentElement.atomicNumber}</span>
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-xl font-sans font-extrabold text-[#2C3E50]">{currentElement.nameAr}</h3>
                          <span className="text-xs text-[#95A5A6] font-mono block">{currentElement.nameEn} • Atomic Mass: {currentElement.atomicMass}</span>
                          <div className="flex gap-2 flex-row-reverse pt-1">
                            <span className="text-[10px] bg-amber-50 text-[#E67E22] border border-amber-200/50 px-2 py-0.5 rounded font-bold">
                              {currentElement.categoryLabel}
                            </span>
                            <span className="text-[10px] bg-[#F9F8F6] text-[#7F8C8D] border border-[#E5E2DE] px-2 py-0.5 rounded font-bold font-mono">
                              STATE: {currentElement.stateLabel}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Nuclear atomic visualization */}
                      <div className="hidden sm:block text-right text-xs text-[#7F8C8D] space-y-1.5 font-mono bg-[#F9F8F6] p-3 rounded border border-[#E5E2DE]">
                        <div><strong className="text-[#2C3E50]">ATOMIC Z:</strong> {currentElement.atomicNumber}</div>
                        <div><strong className="text-[#2C3E50]">MASS A:</strong> {currentElement.atomicMass}</div>
                      </div>
                    </div>

                    {/* Scientific description of the element */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-[#2C3E50] font-sans flex items-center gap-1.5 flex-row-reverse">
                        <Info className="w-4 h-4 text-[#E67E22]" />
                        <span>عن العنصر وخواصه الكيميائية:</span>
                      </h4>
                      <p className="text-xs text-[#1A1A1A] leading-relaxed font-sans">{currentElement.description}</p>
                    </div>

                    {/* Basic Reactions list (Requested feature) */}
                    <div className="space-y-4 pt-3 border-t border-[#E5E2DE]">
                      <h4 className="text-xs font-bold text-[#2C3E50] font-sans flex items-center gap-1.5 flex-row-reverse">
                        <Beaker className="w-4 h-4 text-[#E67E22]" />
                        <span>التفاعلات الكيميائية المتزنة الأساسية:</span>
                      </h4>
                      
                      {currentElement.reactions.length > 0 ? (
                        <div className="space-y-4">
                          {currentElement.reactions.map((rx, rIdx) => (
                            <div 
                              key={rIdx} 
                              className="border border-[#E5E2DE] rounded overflow-hidden shadow-sm"
                            >
                              {/* Equation banner (Dark mode styled, beautifully readable) */}
                              <div className="bg-slate-900 p-3.5 text-center font-mono font-bold text-amber-400 text-sm select-all tracking-wider">
                                {rx.equation}
                              </div>
                              
                              {/* Details info */}
                              <div className="p-4 bg-[#F9F8F6]/55 text-right space-y-2.5 text-xs">
                                <div className="grid grid-cols-2 gap-4 border-b border-[#E5E2DE]/70 pb-2">
                                  <div>
                                    <span className="text-[#95A5A6] block text-[10px] font-bold">المواد الناتجة (Products)</span>
                                    <span className="font-bold text-[#2C3E50]">{rx.products}</span>
                                  </div>
                                  <div>
                                    <span className="text-[#95A5A6] block text-[10px] font-bold">المواد المتفاعلة (Reactants)</span>
                                    <span className="font-bold text-[#2C3E50]">{rx.reactants}</span>
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-[#E67E22] text-[10px] font-extrabold font-sans block">تفسير التفاعل وشروطه:</span>
                                  <p className="text-[#7F8C8D] leading-relaxed text-[11px] font-sans">{rx.description}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-[#95A5A6] italic font-sans">لم ندرج تفاعلات خاصة بهذا العنصر حالياً.</p>
                      )}
                    </div>

                  </div>
                ) : (
                  <div className="p-12 bg-[#F9F8F6] border border-[#E5E2DE] rounded text-center text-xs text-[#7F8C8D]">
                    الرجاء تحديد عنصر من القائمة لعرض تفاعلاته الكيميائية بالتفصيل.
                  </div>
                )}
              </div>

              {/* Left: Element Selection list (Occupies 5 cols on desktop) */}
              <div className="lg:col-span-5 space-y-3 order-2 lg:order-1">
                <span className="text-[11px] font-bold text-[#7F8C8D] block text-right">اختر العنصر الكيميائي المستهدف ({displayedElements.length}):</span>
                <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
                  {displayedElements.map((el) => {
                    const isSelected = currentElement && currentElement.symbol === el.symbol;
                    return (
                      <button
                        key={el.symbol}
                        onClick={() => setSelectedElement(el)}
                        className={`w-full p-3.5 rounded border text-right transition-all flex justify-between items-center flex-row-reverse cursor-pointer ${
                          isSelected
                            ? "bg-amber-50/70 border-[#E67E22] text-[#2C3E50] shadow-sm ring-1 ring-[#E67E22]"
                            : "bg-white border-[#E5E2DE] text-[#7F8C8D] hover:bg-[#F9F8F6]"
                        }`}
                      >
                        {/* Right block: Symbol and names */}
                        <div className="flex gap-3 items-center flex-row-reverse">
                          <span className="w-10 h-10 rounded bg-[#2C3E50]/5 text-[#2C3E50] font-mono font-bold text-xs flex items-center justify-center border border-[#E5E2DE]">
                            {el.symbol}
                          </span>
                          <div className="text-right">
                            <span className="text-xs font-bold text-[#2C3E50] block">{el.nameAr}</span>
                            <span className="text-[10px] text-[#95A5A6] font-mono block">{el.nameEn}</span>
                          </div>
                        </div>

                        {/* Left block: Atomic number badge and indicator */}
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] bg-[#F9F8F6] text-[#7F8C8D] border border-[#E5E2DE] px-2 py-0.5 rounded font-mono font-semibold">
                            Z = {el.atomicNumber}
                          </span>
                          {isSelected && <Check className="w-4 h-4 text-[#E67E22]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          ) : (
            <div className="p-12 bg-[#F9F8F6] border border-[#E5E2DE] rounded text-center space-y-3 shadow-sm">
              <HelpCircle className="w-12 h-12 text-[#BDC3C7] mx-auto" />
              <p className="text-sm font-bold text-[#2C3E50]">لم نعثر على أي عناصر مطابقة</p>
              <p className="text-xs text-[#7F8C8D] max-w-md mx-auto leading-relaxed">
                لم نجد أي عنصر أو تفاعل كيميائي يطابق الكلمة الدلالية أو الحرف المدخل. تيقن من كتابة الرمز الصحيح (مثل Na, Cl) أو الاسم بشكل سليم.
              </p>
            </div>
          )}

        </div>
      )}

      {/* Render flashcards tab */}
      {activeTab === "flashcards" && (
        <FlashcardsView />
      )}
    </div>
  );
};
