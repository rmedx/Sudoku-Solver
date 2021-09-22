'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      let rowConverter = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5, 'G': 6, 'H': 7, "I": 8};
      let regex = /[0-8]/
      let regex2 = /[1-9]/
      if (!req.body.puzzle || !req.body.coordinate || !req.body.value) {
        return res.send({ error: 'Required field(s) missing' });
      }
      let string = req.body.puzzle;
      let coordinate = req.body.coordinate.split("");
      let value = req.body.value;
      let row = rowConverter[coordinate[0].toUpperCase()];
      let column = parseInt(coordinate[1]) - 1;
      if (!solver.validate(string) && string.length == 81) {
        return res.send({ error: 'Invalid characters in puzzle' });
      } 
      if (string.length != 81) {
        return res.send({ error: 'Expected puzzle to be 81 characters long' });
      } 
      if (!regex.test(row) || !regex.test(column)) {
        return res.send({ error: 'Invalid coordinate'});
      }
      if (!regex2.test(value.toString())) {
        return res.send({ error: 'Invalid value' });
      }

      let location = 9 * row + column;
      if (value == string.charAt(location)) {
        let strArr = string.split("");
        strArr[location] = ".";
        string = strArr.join("");
      }
      let rowBool = solver.checkRowPlacement(string, row, column, value);
      let colBool = solver.checkColPlacement(string, row, column, value);
      let regBool = solver.checkRegionPlacement(string, row, column, value);
      let result = rowBool && colBool && regBool;
      if (result) {
        return res.send({"valid": result});
      } else {
        let conflict = [];
        if (!rowBool) {
          conflict.push("row");
        }
        if (!colBool) {
          conflict.push("column");
        }
        if (!regBool) {
          conflict.push("region");
        }
        return res.send({"valid": result, "conflict": conflict});
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      let string = req.body.puzzle;
      if (!string) {
        return res.send({ error: 'Required field missing' });
      } else if (!solver.validate(string) && string.length == 81) {
        return res.send({ error: 'Invalid characters in puzzle' });
      } else if (string.length != 81) {
        return res.send({ error: 'Expected puzzle to be 81 characters long' });
      } else {
        let result = solver.solve(string);
        if (result) {
          return res.send({"solution": result});
        } else {
          return res.send({ error: 'Puzzle cannot be solved' });
        }
      }
    });
};
