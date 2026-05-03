export interface QuestionDto {
    questionId: number;
    courseId: number;
    questionText: string;
    difficultyLevel: string;
    codeSnippet?: string;
    codeLanguage?: string;
    isCode: boolean;
    hasMultipleAnswers: boolean;
    choices: ChoiceDto[];
  }
  
  export interface ChoiceDto {
    choiceId: number;
    questionId: number;
    choiceText: string;
    isCode: boolean;
    isCorrect: boolean;
  }
  