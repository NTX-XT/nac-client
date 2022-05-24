import { Form } from "./form";


export interface WorkflowForms {
    taskForms?: { [key: string]: Form; };
    startForm?: Form;
}
