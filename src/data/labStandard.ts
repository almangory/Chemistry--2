/**
 * 🏛️ المعيار الهندسي والتصميمي الموحد للمعامل والمختبرات الافتراضية التفاعلية
 * منصة المناهج السودانية التفاعلية (بخت الرضا - وزارة التربية والتعليم)
 *
 * وثيقة المعيار القياسي الذهبي المعتمد (Golden Standard Benchmark)
 * يُعتمد هذا الملف كمرجع هيكلي ومعماري لكافة المعامل في الكيمياء، الفيزياء، والأحياء.
 */

export interface LabStandardSpec {
  version: string;
  lastUpdated: string;
  standards: {
    viewport3D: {
      cleanMobileViewport: boolean;
      mobileHeight: string;
      desktopHeight: string;
      topControls: string[];
      prohibitedOnMobileInsideCanvas: string[];
    };
    mobileOutsideDock: {
      telemetryRibbon: string[];
      actionDockButtons: string[];
      observationCard: boolean;
      touchOrbit360: boolean;
    };
    desktopAndFullscreen: {
      floatingHUD: boolean;
      reflectionDrawer: boolean;
      stepNavigation: boolean;
      modalFullscreenFallback: boolean;
    };
    chemicalAccuracy: {
      distilledWaterPurity: string;
      stepAlignment: string;
      phenolphthaleinReaction: string;
    };
    molecularSimulation: {
      physicsEngine: string;
      ionRendering: string;
      spectatorFilter: boolean;
      temperatureKinetics: boolean;
      audioSynthesis: string;
    };
  };
}

export const LAB_GOLDEN_STANDARD: LabStandardSpec = {
  version: "2.4.0-golden",
  lastUpdated: "2026-09-10",
  standards: {
    viewport3D: {
      cleanMobileViewport: true,
      mobileHeight: "h-[320px] sm:h-[380px] md:h-[480px]",
      desktopHeight: "md:h-[480px]",
      topControls: ["كاميرا أمامية", "كاميرا مقربة", "كاميرا علوية", "إعادة ضبط", "تكبير ملء الشاشة [⛶]"],
      prohibitedOnMobileInsideCanvas: [
        "بطاقة القياسات الجانبية (HUD Card)",
        "شريط أزرار الأدوات العائم (Action Bar)",
        "بطاقة الملاحظة الكيميائية (Chemical Note)",
        "لافتة التوجيه الثابتة (Static Drag Banner)"
      ]
    },
    mobileOutsideDock: {
      telemetryRibbon: [
        "درجة الحرارة الحالية (°C)",
        "الرقم الهيدروجيني الديناميكي (pH)",
        "المادة النشطة / حجم الغاز المتصاعد (mL)",
        "حالة الدليل الكاشف / المجال المغناطيسي / الوزن"
      ],
      actionDockButtons: [
        "أزرار لمس مباشرة كبيرة ومريحة للإبهام",
        "تسميات كيميائية دقيقة مع رموز إيموجي مميزة",
        "مؤثرات بصرية عند النقر (Active feedback)",
        "زر تفريغ وتنظيف الحوض للبدء من جديد"
      ],
      observationCard: true,
      touchOrbit360: true
    },
    desktopAndFullscreen: {
      floatingHUD: true,
      reflectionDrawer: true,
      stepNavigation: true,
      modalFullscreenFallback: true
    },
    chemicalAccuracy: {
      distilledWaterPurity: "الماء المقطر في البداية نقي وشفاف وعديم اللون تماماً (100% Colorless & Pure)",
      stepAlignment: "تطابق تسلسل الخطوات بنسبة 1:1 مع سجلات الانعكاس المعملي وكتاب بخت الرضا",
      phenolphthaleinReaction: "دليل الفينول فثالين عديم اللون في الوسط المتعادل والحمضي، ويتحول للوردي الأرجواني فقط عند تكون القلوي (pH > 8.2)"
    },
    molecularSimulation: {
      physicsEngine: "تصادم مرن ثنائي الأبعاد بدون أي تداخل أو اختراق للكرات (Elastic Collision Physics)",
      ionRendering: "كرات أيونية مجسمة 3D بتدرجات كروية ولمعان زجاجي وهالات شحنة كهربائية متوهجة",
      spectatorFilter: true,
      temperatureKinetics: true,
      audioSynthesis: "مؤثرات صوتية اصطناعية داخلية عبر Web Audio API بدون أي ملفات خارجية"
    }
  }
};
