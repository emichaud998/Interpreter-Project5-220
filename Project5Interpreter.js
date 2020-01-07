//Checks what type of expression e is and returns the value of the expression
function interpExpression(state, e) {
  //If e is a number or boolean return the value of e
  if (e.kind === 'number') {
    return e.value;
  } 

  if (e.kind === 'boolean'){
    return e.value;
  }

  //If e is a variable find that variable in the state object and return its value
  if (e.kind === 'variable'){
    let val = lib220.getProperty(state, e.name);
    if(val.found){
      return val.value;
    }
  }

  //If e is an operator find the value of e1 and e2 and perform the operator for e on them
  else if (e.kind === 'operator') {
    if (e.op === '+') {
      return interpExpression(state, e.e1) + interpExpression(state, e.e2);
    } 
    else if (e.op === '-') {
      return interpExpression(state, e.e1) - interpExpression(state, e.e2);
    } 
    else if (e.op === '*'){
      return interpExpression(state, e.e1) * interpExpression(state, e.e2);
    }
    else if (e.op === '/'){
      return interpExpression(state, e.e1) / interpExpression(state, e.e2);
    }
    else if (e.op === '&&'){
      return interpExpression(state, e.e1) && interpExpression(state, e.e2);
    }
    else if (e.op === '||'){
      return interpExpression(state, e.e1) || interpExpression(state, e.e2);
    }
    else if (e.op === '>'){
      return interpExpression(state, e.e1) > interpExpression(state, e.e2);
    }
    else if (e.op === '<'){
      return interpExpression(state, e.e1) < interpExpression(state, e.e2);
    }
    else if (e.op === '==='){
      return interpExpression(state, e.e1) === interpExpression(state, e.e2);
    }
  }  
  else {
    assert(false);
  }
}

//Checks a single statement in a function and updates the state object according to the statement (s is a statement type)
function interpStatement(state, s) {
  //Creates a variable s.name in the state object equal to the expression in s
  if (s.kind === 'let') {
    let value = interpExpression(state, s.expression); 
    lib220.setProperty(state, s.name, value);
  }
  //Changes the value of the variable given by s.name in the state object to the value of s.expression 
  if (s.kind === 'assignment') {
    let value = interpExpression(state, s.expression); //returns the value of the expression that we are changing the value of the variable to
    lib220.setProperty(state, s.name, value);
  }
  //Determines whether the true or false part of the if statement should be interpreted
  if (s.kind === 'if') {
    let value = interpExpression(state, s.test); //Returns either true of false
    if (value) {
      interpBlock(state, s.truePart);
    }  
    else {
      interpBlock(state, s.falsePart);
    }
  }
  //Interprets statement until while statement expression is not true anymore
  if (s.kind === 'while') {
    while (interpExpression(state, s.test)) {
      interpBlock(state, s.body);
    }
  }

  if (s.kind === 'print'){
    console.log(interpExpression(state, s.expression));
  }
}

//Interprets an array of statements
function interpBlock(state, arr){
  for (let i = 0; i < arr.length; ++i){
    interpStatement(state, arr[i]);
  }
}

//Inteprets a program by interpreting its array of statements and returns the state object of the program
function interpProgram(s){
  let state = {};
  for (let i = 0; i < s.length; ++i){
    interpStatement(state, s[i]);
  }
  return state;
}

//Testing
test("multiplication with a variable", function() {
let r = interpExpression({ x: 10, y: 5, z: 15 }, parser.parseExpression("x * y + z").value);
assert(r === 65);
});

test("assignment", function() {
let st = interpProgram(parser.parseProgram("let x = 10; x = 20;").value);
assert(st.x === 20);
});

test("factorial", function() {
let st = interpProgram(parser.parseProgram("let num = 5; let factorial = 1; let i = 2; while (i < num || i === num) { factorial = factorial * i;i = i + 1;}").value);
assert(st.factorial === 120);
});

test("fibonacci", function() {
let st = interpProgram(parser.parseProgram("let num = 5; let a = 1; let fib = 0; let temp = 0; while (num > 0 || num === 0){ temp = a; a = a + fib; fib = temp; num = num - 1;}").value);
assert(st.fib === 8);
});
