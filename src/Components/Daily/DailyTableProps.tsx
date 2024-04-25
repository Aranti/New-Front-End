export interface DailyTableProps {
    item: Item;
    getLevelColor: any;
    getBlockInfo: any;
}

export interface Item {
    name: string;
    status: number;
    rows: any[];
    id: number;
    columns: string[];
    data: any[];
}