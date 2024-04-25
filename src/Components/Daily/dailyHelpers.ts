export const getStatusColor = (item: { status: number }) => {
    if(item.status == 2 || item.status == 3) {
        return "5px solid red";
    }
    else if(item.status == 1) {
        return "5px solid #007bff";
    }
    else {
        return "1px solid #eee";
    }
};

export const getLevelColor = (item: { status: number }) => {
    if(item.status == 2 || item.status == 3) {
        return "red";
    }
    else if(item.status == 1) {
        return "#007bff";
    }
    else {
        return "#5b6e84";
    }
}