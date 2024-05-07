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
      "https://drive.google.com/file/d/1aBt_BfrHHPWV9EKv87CVpncrkffPFYIa/view?usp=sharing",
    otherResources: "",
    acute: true,
    chronic: false,
  },
  {
    drugName: "ibuprofen 200mg",
    pilLink: "https://www.healthhub.sg/a-z/medications/ibuprofen",
    drugImagesLink:
      "https://www.mediview.sg/keyword/n-zXKQXN/ibuprofen/i-FfDfp99/A",
    counsellingPointsText: "This is for pain or fever. Take after food.",
    counsellingPointsVoiceLink:
      "https://drive.google.com/file/d/1Kz3Az06UMNGsyEmUcYV-1c9wB6PPMChq/view?usp=drive_link",
    otherResources: "",
    acute: true,
    chronic: false,
  },
  {
    drugName: "metformin 250mg",
    pilLink: "https://www.healthhub.sg/a-z/medications/metformin",
    drugImagesLink:
      "https://www.mediview.sg/keyword/n-zXKQXN/metformin/i-x2BL3nZ/A",
    counsellingPointsText: "This is for diabetes. Take after food.",
    counsellingPointsVoiceLink:
      "https://drive.google.com/file/d/1a_X_zXkWDP1oHPwCsgSMsPS7MRBF2SgT/view?usp=drive_link",
    otherResources:
      "https://www.health.harvard.edu/blog/is-metformin-a-wonder-drug-202109222605",
    acute: false,
    chronic: true,
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
