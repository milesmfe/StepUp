import assert from "assert";
import { processUserData } from "../components/Leaderboard";

// Write leaderboard tests
test("Process: Data Exists", async () => {
  fetch("./leaderboardTest.json")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    const testData = processUserData(data);
    expect(testData).toBeDefined();
  })
});

test("Process: Data Correct Length", async () => {
    fetch("./leaderboardTest.json")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      const testData = processUserData(data);
      expect(testData).toHaveLength(6);
    })
  });

  test("Process: Data Correct Values", async () => {
    //Create Accurate Data list
    const dummyData = [];
    dummyData.push(["JackSouster", 100]);
    dummyData.push(["darren -G", 7]);
    dummyData.push(["Cierre", 5]);
    dummyData.push(["Max B", 3]);
    dummyData.push(["Lewis John", 0]);

    fetch("./leaderboardTest.json")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      const testData = processUserData(data);
      expect(testData).toBe(dummyData);
    })
  });


