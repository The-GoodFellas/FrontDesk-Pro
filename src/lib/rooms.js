export const rooms = [
    { number: "101", status: "Available", type: "Single", price: "$100" },
    { number: "102", status: "Available", type: "Double", price: "$150" },
    { number: "103", status: "Available", type: "Suite", price: "$200" },
    { number: "104", status: "Available", type: "Single", price: "$100" },
    { number: "105", status: "Available", type: "Double", price: "$150" },
    { number: "106", status: "Available", type: "Suite", price: "$200" },
    { number: "107", status: "Available", type: "Single", price: "$100" },
    { number: "108", status: "Available", type: "Double", price: "$150" },
    { number: "109", status: "Available", type: "Suite", price: "$200" },
    { number: "110", status: "Available", type: "Single", price: "$100" },
    { number: "201", status: "Available", type: "Suite", price: "$200" },
    { number: "202", status: "Available", type: "Single", price: "$100" },
    { number: "203", status: "Available", type: "Double", price: "$150" },
    { number: "204", status: "Available", type: "Suite", price: "$200" },
    { number: "205", status: "Available", type: "Single", price: "$100" },
    { number: "206", status: "Available", type: "Double", price: "$150" },
    { number: "207", status: "Available", type: "Suite", price: "$200" },
    { number: "208", status: "Available", type: "Single", price: "$100" },
    { number: "209", status: "Available", type: "Double", price: "$150" },
    { number: "210", status: "Available", type: "Suite", price: "$200" },
    { number: "301", status: "Available", type: "Single", price: "$100" },
    { number: "302", status: "Available", type: "Double", price: "$150" },
    { number: "303", status: "Available", type: "Suite", price: "$200" },
    { number: "304", status: "Available", type: "Single", price: "$100" },
    { number: "305", status: "Available", type: "Double", price: "$150" },
    { number: "306", status: "Available", type: "Suite", price: "$200" },
    { number: "307", status: "Available", type: "Single", price: "$100" },
    { number: "308", status: "Available", type: "Double", price: "$150" },
    { number: "309", status: "Available", type: "Suite", price: "$200" },
    { number: "310", status: "Available", type: "Single", price: "$100" },
    { number: "401", status: "Available", type: "Double", price: "$150" },
    { number: "402", status: "Available", type: "Suite", price: "$200" },
    { number: "403", status: "Available", type: "Single", price: "$100" },
    { number: "404", status: "Available", type: "Double", price: "$150" },
    { number: "405", status: "Available", type: "Suite", price: "$200" },
    { number: "406", status: "Available", type: "Single", price: "$100" },
    { number: "407", status: "Available", type: "Double", price: "$150" },
    { number: "408", status: "Available", type: "Suite", price: "$200" },
    { number: "409", status: "Available", type: "Single", price: "$100" },
    { number: "410", status: "Available", type: "Double", price: "$150" },
    { number: "501", status: "Available", type: "Suite", price: "$200" },
    { number: "502", status: "Available", type: "Single", price: "$100" },
    { number: "503", status: "Available", type: "Double", price: "$150" },
    { number: "504", status: "Available", type: "Suite", price: "$200" },
    { number: "505", status: "Available", type: "Single", price: "$100" },
    { number: "506", status: "Available", type: "Double", price: "$150" },
    { number: "507", status: "Available", type: "Suite", price: "$200" },
    { number: "508", status: "Available", type: "Single", price: "$100" },
    { number: "509", status: "Available", type: "Double", price: "$150" },
    { number: "510", status: "Available", type: "Suite", price: "$200" },
];

export function findRoom(number) {
    return rooms.find(r => String(r.number) === String(number));
}

export function setRoomStatus(number, status) {
    const room = rooms.find(r => String(r.number) === String(number));
    if (room) {
        room.status = status;
    }
}
