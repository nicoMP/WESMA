/* Sample:

import * as quizQuestionFormats from "path to file";
let question = new quizQuestionFormats.SingleChoiceMC(2, 'test', ['1'], '1');
let quiz = new Quiz('test', 1, false, [test.asJSON()]));
*/

export default class Quiz {
    quizName: string;
    moduleID: string;
    isGraded: boolean = true;
    quizContent: [];
    contentId: number;

    constructor(quizName: string, moduleID: string, isGraded: boolean = true, quizContent: [], contentId: number) {
        this.quizName = quizName;
        this.moduleID = moduleID;
        this.isGraded = isGraded;
        this.quizContent = quizContent;
        this.contentId = contentId;
    }

    asJSON() {
        return {
            "quizName": this.quizName,
            "moduleID": this.moduleID,
            "isGraded": this.isGraded,
            "quizContent": this.quizContent,
            "contentId": this.contentId
        } 
    }
}