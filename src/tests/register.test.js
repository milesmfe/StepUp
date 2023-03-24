import { render, screen, cleanup} from '@testing-library/react';
import { act } from "react-dom/test-utils";
import Register from "../components/Register";
import { unmountComponentAtNode } from "react-dom";
import {
    handleSubmit,
    containsNumbers,
    containsLowercase,
    containsUppercase,
    containsSpecials,
} from "../components/Register";

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("Page successfully renders", () => {
    expect(container === null).toBe(false);
  });

// Unit tests ---------------------------------------------- //

test("data not containing numbers", () =>{
    const result = containsNumbers("testdatawithoutnumbers");
    expect(result).toBe(false);
})

test("data containing numbers", () =>{
    const result = containsNumbers("testdatawithnumbers1");
    expect(result).toBe(true);
})

test("data not containing lowercase", () =>{
    const result = containsLowercase("TESTDATAWITHOUTLOWERCASE");
    expect(result).toBe(false);
})

test("data containing lowercase", () =>{
    const result = containsLowercase("testdatawithlowercase");
    expect(result).toBe(true);
})

test("data not containing uppercase", () =>{
    const result = containsUppercase("testdatawithoutuppercase");
    expect(result).toBe(false);
})

test("data containing numbers", () =>{
    const result = containsUppercase("TESTDATAWITHUPPERCASE");
    expect(result).toBe(true);
})

test("data not containing special characters", () =>{
    const result = containsSpecials("testdatawithoutspecialcharacters");
    expect(result).toBe(false);
})

test("data containing numbers", () =>{
    const result = containsSpecials("testdatawithwithspecialcharaters£");
    expect(result).toBe(true);
})