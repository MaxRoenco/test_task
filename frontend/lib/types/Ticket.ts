import Message from "./Message";
import User from "./User";
import Attachment from "./Attachment";

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
    createdAt: Date;
    updatedAt: Date;
    bugType: BugType;
    statusBug: StatusBug;
    priority: Priority;
    attachments: Attachment[];
    messages: Message[];
    user: User;
}
