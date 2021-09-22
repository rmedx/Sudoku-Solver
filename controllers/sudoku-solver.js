const { test } = require("mocha");

var solution;

class SudokuSolver {
  validate(puzzleString) {
    let regex = /[1-9\.]{81}/
    return regex.test(puzzleString);
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let rowArr = ["instantiate"];
    for (let i = 0; i < 9; i++) {
      rowArr[i] = [];
    }
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        let char = puzzleString.charAt(9 * i + j);
        if (char == ".") {
          continue;
        }
        rowArr[i].push(char);
      }
    }
    return !rowArr[row].includes(value);
  }

  checkColPlacement(puzzleString, row, column, value) {
    let colArr = ["instantiate"];
    for (let i = 0; i < 9; i++) {
      colArr[i] = [];
    }
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        let char = puzzleString.charAt(9 * i + j);
        if (char == ".") {
          continue;
        }
        colArr[j].push(char);
      }
    }
    return !colArr[column].includes(value);
  }

  // regions:
  // 0, 10, 20
  // 1, 11, 21
  // 2, 12, 22
  checkRegionPlacement(puzzleString, row, column, value) {
    let regionArr = {0: ["instantiate"], 1: ["instantiate"], 2: ["instantiate"], 10: ["instantiate"], 11: ["instantiate"], 12: ["instantiate"], 20: ["instantiate"], 21: ["instantiate"], 22: ["instantiate"]};
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        let char = puzzleString.charAt(9 * i + j);
        if (char == ".") {
          continue;
        }
        regionArr[Math.floor(j / 3) * 10 + Math.floor(i / 3)].push(char);
      }
    }
    return !regionArr[Math.floor(column / 3) * 10 + Math.floor(row / 3)].includes(value);
  }

  solve(puzzleString) {
    if (!this.validate(puzzleString)) {
      return "invalid";
    } else {
      let inputArr = puzzleString.split("");
      return this.recursiveSolve(inputArr) ? solution.join("") : false;
    }
  }

  recursiveSolve(puzzleArr) {
    // console.log(puzzleArr.join(""));
    let unfilled = puzzleArr.indexOf(".");
    if (unfilled == -1) {
      solution = puzzleArr;
      return true;
    }
    let row = Math.floor(unfilled / 9);
    let col = unfilled % 9;
    for (let x = 1; x <= 9; x++) {
      if (this.checkValid(puzzleArr, row, col, x.toString())) {
        puzzleArr[unfilled] = x.toString();
        if (this.recursiveSolve(puzzleArr)) {
          return true;
        } else {
          puzzleArr[unfilled] = ".";
        }
      }
    }
    return false;
  }

  checkValid(puzzleArr, row, column, value) {
    let regionArr = {0: [], 1: [], 2: [], 10: [], 11: [], 12: [], 20: [], 21: [], 22: []};
    let rowArr = [];
    let colArr = [];
    for (let i = 0; i < 9; i++) {
      colArr[i] = [];
      rowArr[i] = [];
    }
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        let char = puzzleArr[9 * i + j];
        if (char == ".") {
          continue;
        }
        regionArr[Math.floor(j / 3) * 10 + Math.floor(i / 3)].push(char);
        colArr[j].push(char);
        rowArr[i].push(char);
      }
    }
    let regBool = regionArr[Math.floor(column / 3) * 10 + Math.floor(row / 3)].indexOf(value) == -1;
    let rowBool = rowArr[row].indexOf(value) == -1;
    let colBool = colArr[column].indexOf(value) == -1;
    let result = regBool && rowBool && colBool;
    return result
  }
}

module.exports = SudokuSolver;