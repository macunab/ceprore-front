
export interface Column<T> {
    field: keyof T;
    title: string;
}

export interface TableEvent<T> {
    data: T;
    type: string;
}

export interface ButtonConfig {
    title?: string;
    class: string;
    functionType: string;
    icon?: string;
    tooltipText?: string;
}