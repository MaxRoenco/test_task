import Message from "./Message";
import User from "./User";
import Image from "./Image";

export enum BugType {
    UI = 'UI',
    Backend = 'Backend',
    Performance = 'Performance',
    Security = 'Security',
}

export enum StatusBug {
    Open = 'Open',
    InProgress = 'In Progress',
    Closed = 'Closed',
}

export enum Priority {
    Low = 'Low',
    Medium = 'Medium',
    High = 'High',
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
