// Spread 연산자
let firstArray = [1, 2, 3];
let secondArray = [4, 5, 6];

let combine = [...firstArray, ...secondArray];

for (let i = 0; i < combine.length; i++) {
  console.log(combine[i]); // 1 2 3 4 5 6
}
