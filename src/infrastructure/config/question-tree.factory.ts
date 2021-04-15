import * as fs from "fs";
import YAML from "yaml";
import { Choice, Question } from "../../domain/support/question-tree";

type RawChoice = {
    label: string;
    link: { content: string } | RawQuestionTree;
};

export type RawQuestionTree = {
    title: string;
    choices: RawChoice[];
};

export const checkRawQuestionTreeType = (
    rawQuestionTree: unknown
): rawQuestionTree is RawQuestionTree => {
    if (typeof rawQuestionTree !== "object" || !rawQuestionTree) {
        return false;
    }
    if (!("title" in rawQuestionTree)) {
        return false;
    }
    if (!("choices" in rawQuestionTree)) {
        return false;
    }
    const candidate = rawQuestionTree as RawQuestionTree;
    if (typeof candidate.title !== "string") {
        return false;
    }
    if (!candidate.choices) {
        return false;
    }
    if (!(candidate.choices instanceof Array)) {
        return false;
    }
    return candidate.choices.reduce((acc: boolean, choice: unknown) => {
        if (typeof choice !== "object" || !choice) {
            return false;
        }
        if (!("label" in choice)) {
            return false;
        }
        if (!("link" in choice)) {
            return false;
        }
        const candidate = choice as RawChoice;
        if (!candidate.label) {
            return false;
        }
        if (!candidate.link) {
            return false;
        }
        if ("content" in candidate.link) {
            return acc && candidate.link.content !== undefined;
        }
        return acc && checkRawQuestionTreeType(candidate.link);
    }, true);
};

export const checkQuestionTreeType = (
    questionTree: unknown
): questionTree is Question => {
    if (typeof questionTree !== "object" || !questionTree) {
        return false;
    }
    if (!("title" in questionTree)) {
        return false;
    }
    if (!("choices" in questionTree)) {
        return false;
    }
    const candidate = questionTree as Question;
    if (typeof candidate.title !== "string") {
        return false;
    }
    if (!candidate.choices) {
        return false;
    }
    if (!(candidate.choices instanceof Array)) {
        return false;
    }
    return candidate.choices.reduce((acc: boolean, choice: unknown) => {
        if (typeof choice !== "object" || !choice) {
            return false;
        }
        if (!("id" in choice)) {
            return false;
        }
        if (!("label" in choice)) {
            return false;
        }
        if (!("link" in choice)) {
            return false;
        }
        const candidate = choice as Choice;
        if (!candidate.id) {
            return false;
        }
        if (!candidate.label) {
            return false;
        }
        if (!candidate.link) {
            return false;
        }
        if ("content" in candidate.link) {
            return acc && candidate.link.content !== undefined;
        }
        return acc && checkQuestionTreeType(candidate.link);
    }, true);
};

export const buildQuestionTree = (): Question => {
    const yamlFileContent = fs.readFileSync(
        "config/question-tree.yaml",
        "utf8"
    );

    const rawQuestionTree = YAML.parse(yamlFileContent) as unknown;
    return rawQuestionTree as Question;
};
