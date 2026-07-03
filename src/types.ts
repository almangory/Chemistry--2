export interface Lesson {
  id: string;
  title: string;
  subtitle?: string;
  image?: string; // custom-generated or curated path
  content: string[]; // HTML/Markdown paragraph strings
  summary: string[]; // key bullet points for summary
  illustrations: {
    title: string;
    description: string;
    svgType: string; // identifier to render custom interactive SVGs
  }[];
}

export interface Unit {
  id: string;
  number: number;
  title: string;
  description: string;
  color: string; // Tailwind color classes
  lessons: Lesson[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option
  explanation: string;
  lessonId?: string;
}

export interface UnitQuiz {
  unitId: string;
  questions: QuizQuestion[];
}

export interface GlossaryTerm {
  term: string;
  englishTerm?: string;
  definition: string;
  unitId: string;
}

export interface LabExperiment {
  id: string;
  title: string;
  unitId: string;
  description: string;
  setup: {
    reactants: string[];
    apparatus: string[];
  };
  steps: {
    instruction: string;
    actionLabel: string;
    resultingState: string;
  }[];
}
