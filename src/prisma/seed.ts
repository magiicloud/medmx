import prisma from "./client";

const drugData = [
  {
    drugName: "paracetamol 500mg",
    pilLink: "https://www.healthhub.sg/a-z/medications/paracetamol-oral",
    drugImagesLink:
      "https://www.mediview.sg/keyword/n-zXKQXN/paracetamol/i-Nkr8kGL/A",
    counsellingPointsText:
      "This is for pain or fever. Take with or without food.",
    counsellingPointsVoiceLink:
      "https://storage.cloud.google.com/magicloud-medlabel-bucket/counselling-audio/paracet.mp3",
    otherResources: "",
    acute: true,
    chronic: false,
    auxInstruction: "Take with or without food. Do not exceed 8 in a day.",
  },
  {
    drugName: "ibuprofen 200mg",
    pilLink: "https://www.healthhub.sg/a-z/medications/ibuprofen",
    drugImagesLink:
      "https://www.mediview.sg/keyword/n-zXKQXN/ibuprofen/i-FfDfp99/A",
    counsellingPointsText: "This is for pain or fever. Take after food.",
    counsellingPointsVoiceLink:
      "https://storage.cloud.google.com/magicloud-medlabel-bucket/counselling-audio/ibuprofen.mp3",
    otherResources: "",
    acute: true,
    chronic: false,
    auxInstruction: "Take after food.",
  },
  {
    drugName: "metformin 250mg",
    pilLink: "https://www.healthhub.sg/a-z/medications/metformin",
    drugImagesLink:
      "https://www.mediview.sg/keyword/n-zXKQXN/metformin/i-x2BL3nZ/A",
    counsellingPointsText: "This is for diabetes. Take after food.",
    counsellingPointsVoiceLink:
      "https://storage.cloud.google.com/magicloud-medlabel-bucket/counselling-audio/metformin.mp3",
    otherResources:
      "https://www.health.harvard.edu/blog/is-metformin-a-wonder-drug-202109222605",
    acute: false,
    chronic: true,
    auxInstruction: "Take after food.",
  },
];

const drugClassData = [
  { name: "antipyretic" },
  { name: "analgesic" },
  { name: "diabetes" },
];

const drugToClassData = [
  {
    drugId: 1,
    drugClassId: 1,
  },
  {
    drugId: 1,
    drugClassId: 2,
  },
  {
    drugId: 2,
    drugClassId: 1,
  },
  {
    drugId: 2,
    drugClassId: 2,
  },
  {
    drugId: 3,
    drugClassId: 3,
  },
];

const drugEntryData = [
  {
    drugId: 1,
    method: "Take",
    unitDose: "Tab",
  },
  {
    drugId: 2,
    method: "Take",
    unitDose: "Tab",
  },
  {
    drugId: 3,
    method: "Take",
    unitDose: "Tab",
  },
];

const userDrugData = [
  {
    userId: 1,
    drugId: 1,
    dosingInstruction: "Take 2 tablet(s) 4 times a day when required.",
  },
  {
    userId: 1,
    drugId: 2,
    dosingInstruction: "Take 1 tablet(s) 3 times a day when required.",
  },
  {
    userId: 2,
    drugId: 3,
    dosingInstruction: "Take 1 tablet(s) 3 times a day.",
  },
];

const usersData = [
  {
    email: "paloma@diamond.com",
    name: "Paloma Diamond",
  },
  {
    email: "lorelai@lynch.com",
    name: "Lorelai Lynch",
  },
];

async function main() {
  // Seed users
  for (const user of usersData) {
    await prisma.user.create({
      data: user,
    });
  }

  // Seed drugs
  for (const drug of drugData) {
    await prisma.drug.create({
      data: drug,
    });
  }

  // Seed drug classes
  for (const drugClass of drugClassData) {
    await prisma.drugClass.create({
      data: drugClass,
    });
  }

  // Seed drug to class relations
  for (const relation of drugToClassData) {
    await prisma.drugToClass.create({
      data: relation,
    });
  }

  // Seed drug entry
  for (const drugEntry of drugEntryData) {
    await prisma.drugEntry.create({
      data: drugEntry,
    });
  }

  // Seed user drug entry
  for (const userDrug of userDrugData) {
    await prisma.userDrug.create({
      data: userDrug,
    });
  }
}

main()
  .then(() => {
    console.log("Data seeding completed.");
  })
  .catch((e) => {
    console.error("Error during data seeding:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
