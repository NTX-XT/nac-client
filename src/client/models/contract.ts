export interface Contract {
    id: string;
    name: string;
    description?: string;
    appId: string;
    icon: string;
    actions: {
        type: string;
        name: string;
    }[],
    events: {
        type: string;
        name: string;
    }[]
}
