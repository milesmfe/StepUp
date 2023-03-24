import assert from "assert";
import {
  giveUserFlowerCard,
  giveUserFlowerCardList,
  packedGardenSchema,
  readFlowerCardData,
  readFormattedGardenData,
  readGardenData,
  removeUserFlowerCard,
  unpackedGardenSchema,
  writeGardenData,
  writeNewFlowerCard,
  writeProfileDetails,
  writeUserCreationDetails,
} from "../database";

const testingAccountRef = "TESTING-ACCOUNT";
const dummyData = {
  seeds: [{ sectionId: "S" }],
  planted: [{ sectionId: "P" }],
};

// Write firebase tests

// Schema stress test ------------------------------------------------ //

test("Stress: Schema", async () => {
  let garden = packedGardenSchema(dummyData);
  garden = await unpackedGardenSchema(garden);
  garden = packedGardenSchema(garden);
  garden = await unpackedGardenSchema(garden);
  garden = packedGardenSchema(garden);
  garden = await unpackedGardenSchema(garden);
  garden = packedGardenSchema(garden);
  assert.equal(garden.seeds[0].sectionId, "S");
  assert.equal(garden.planted[0].sectionId, "P");
});

// Read Queries ------------------------------------------------------ //

test("Read: readGardenData", async () => {
  const testGarden = await readGardenData(testingAccountRef);
  // console.log(testGarden);
});

test("Read: readFlowerCardData", async () => {
  const defaultFlowerCard = await readFlowerCardData("", "default");
  // console.log(defaultFlowerCard);
});

test("Temp", async () => {
  // writeNewFlowerCard("lvl0", {});
});

// ------------------------------------------------------------------- //
