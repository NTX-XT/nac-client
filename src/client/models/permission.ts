
export interface Permission {
    id: string;
    name: string;
    email?: string;
    type: string;
    isOwner: boolean;
    isUser: boolean;
}
