const chars = [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f']

export function randomBoundary(lengthA = 24, lengthB = 16) {
    let boundary = "-".repeat(lengthA);
    boundary += Array.from(Array(lengthB)).map(() => chars[Math.floor(Math.random()*16)]).join('')
    return boundary;
}
