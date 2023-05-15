// Standard MC question with one answer
export class SingleChoiceMC {
    type: string = 'single-choice-mc';
    marks: number;
    question: string;
    choices: string[];
    answer: string;

    constructor(marks: number, question: string, choices: string[], answer: string) {
        this.marks = marks;
        this.question = question;
        this.choices = choices;
        this.answer = answer;
    }

    asJSON() {
        return {
            "type": this.type,
            "marks": this.marks,
            "question": this.question,
            "choices": this.choices,
            "answer": this.answer
        } 
    }
}

// MC question but with multiple right answers
export class MultiChoiceMC {
    type: string = 'multi-choice-mc';
    marks: number;
    question: string;
    choices: string[];
    answer: string[];

    constructor(marks: number, question: string, choices: string[], answer: string[]) {
        this.marks = marks;
        this.question = question;
        this.choices = choices;
        this.answer = answer;
    }

    asJSON() {
       return {
		"type": this.type,
		"marks": this.marks,
		"question": this.question,
		"choices": this.choices,
		"answer": this.answer
	   } 
    }
}

// Matching question, idk if we want this but added it just incase we decide to add it
// Answer might be a 2 element array where first element is the option and the second is the correct choice for the option
export class Matching {
    type: string = 'matching';
    marks: number;
    question: string;
    options: string[];
    choices: string[];
	answer: [];

    constructor(marks: number, question: string, options: string[], choices: string[], answer: []) {
        this.marks = marks;
        this.question = question;
		this.options = options;
        this.choices = choices;
        this.answer = answer;
    }

    asJSON() {
       return {
		"type": this.type,
		"marks": this.marks,
		"question": this.question,
		"options": this.options,
		"choices": this.choices,
		"answer": this.answer
	   } 
    }
}

// Fill in the blank, idk if we want this either but adding it incase
// Maybe split the question at the blank and store the before and after blank strings?
export class FillBlank {
    type: string = 'fill-in-blank';
    marks: number;
    questionPreBlank: string;
	questionPostBlank: string;
    answer: string;

    constructor(marks: number, question: string, questionPreBlank: string, questionPostBlank: string, answer: string) {
        this.marks = marks;
        this.questionPreBlank = questionPreBlank;
		this.questionPostBlank = questionPostBlank;
        this.answer = answer;
    }

    asJSON() {
       return {
		"type": this.type,
		"marks": this.marks,
		"questionPreBlank": this.questionPreBlank,
		"questionPostBlank": this.questionPostBlank,
		"answer": this.answer
	   } 
    }
}
