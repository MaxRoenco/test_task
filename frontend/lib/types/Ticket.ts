import Message from "./Message";
import User from "./User";
import Image from "./Image";

export enum BugType {
    UI = 'UI',
    BACKEND = 'Backend',
    PERFORMANCE = 'Performance',
    SECURITY = 'Security',
}

export enum StatusBug {
    OPEN = 'Open',
    IN_PROGRESS = 'In Progress',
    CLOSED = 'Closed',
}

export enum Priority {
    LOW = 'Low',
    MEDIUM = 'Medium',
    HIGH = 'High',
}

export default interface Ticket {
    id: number;
    documentId: string;
    subject: string;
    text: string;
    createdAt: string;
    updatedAt: string;
    bugType: BugType;
    statusBug: StatusBug;
    priority: Priority;
    images: Image[];
    messages: Message[];
    user: User;
}
