export interface MainPanelProps {
    item: Item1;
    getLevelColor: any;
    passItem: any;
    categoryHandler(subitem: any): void;
}

export interface Item1 {
    name: string;
    status: number;
    rows: any[];
    id: number;
    columns: string[];
    data: any[];
}