import type RecoveryQuestions from "./recoveryQuestions";

export default class User {
    id: string;
    username: string; 
    email: string;
    password: string;
    recovery_questions: RecoveryQuestions[] | null;
    creation_method: string;
    constructor(
        id: string,
        username: string,
        email: string,
        password: string,
        recovery_questions: RecoveryQuestions[] | null,
        creation_method: string,
    ) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.recovery_questions = recovery_questions;
        this.creation_method = creation_method;
    }
}