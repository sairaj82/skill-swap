export interface Skill {
    id: string;
    name: string;
    category: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    password?: string;
    bio?: string;
    location?: string;
    teaching: Skill[];
    learning: Skill[];
}

export interface AuthCredentials {
    email: string;
    password?: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password?: string;
}
