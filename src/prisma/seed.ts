import prisma from "./client";

const drugData = [
  {
    drugName: "PARACETAMOL 500MG",
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
    drugName: "LORATADINE 10MG TAB",
    pilLink: "https://www.healthhub.sg/a-z/medications/ibuprofen",
    drugImagesLink:
      "https://www.mediview.sg/keyword/n-zXKQXN/ibuprofen/i-FfDfp99/A",
    counsellingPointsText: "This is for runny nose.",
    counsellingPointsVoiceLink:
      "https://storage.cloud.google.com/magicloud-medlabel-bucket/counselling-audio/ibuprofen.mp3",
    otherResources: "",
    acute: true,
    chronic: false,
    auxInstruction:
      "May be taken with or without food. May affect alertness.Warning - avoid alcoholic drinks.",
  },
  {
    drugName: "DEQUALINIUM 0.25MG LOZENGES",
    pilLink: "https://www.healthhub.sg/a-z/medications/metformin",
    drugImagesLink:
      "https://www.mediview.sg/keyword/n-zXKQXN/metformin/i-x2BL3nZ/A",
    counsellingPointsText: "This is for sore throat.",
    counsellingPointsVoiceLink:
      "https://storage.cloud.google.com/magicloud-medlabel-bucket/counselling-audio/metformin.mp3",
    otherResources:
      "https://www.health.harvard.edu/blog/is-metformin-a-wonder-drug-202109222605",
    acute: true,
    chronic: false,
    auxInstruction:
      "May be taken with or without food. To suck and allow to dissolve slowly in the mouth.",
  },
  {
    drugName: "DIFFLAM (BENZYDAMINE 3MG) LOZENGES",
    pilLink: "https://www.healthhub.sg/a-z/medications/metformin",
    drugImagesLink:
      "https://www.mediview.sg/keyword/n-zXKQXN/metformin/i-x2BL3nZ/A",
    counsellingPointsText: "This is for sore throat.",
    counsellingPointsVoiceLink:
      "https://storage.cloud.google.com/magicloud-medlabel-bucket/counselling-audio/metformin.mp3",
    otherResources:
      "https://www.health.harvard.edu/blog/is-metformin-a-wonder-drug-202109222605",
    acute: true,
    chronic: false,
    auxInstruction:
      "May be taken with or without food. To suck and allow to dissolve slowly in the mouth.",
  },
  {
    drugName: "CHARCOAL 200MG CAP",
    pilLink: "https://www.healthhub.sg/a-z/medications/metformin",
    drugImagesLink:
      "https://www.mediview.sg/keyword/n-zXKQXN/metformin/i-x2BL3nZ/A",
    counsellingPointsText: "This is for diarrhea.",
    counsellingPointsVoiceLink:
      "https://storage.cloud.google.com/magicloud-medlabel-bucket/counselling-audio/metformin.mp3",
    otherResources:
      "https://www.health.harvard.edu/blog/is-metformin-a-wonder-drug-202109222605",
    acute: true,
    chronic: false,
    auxInstruction:
      "Take half to one hour before food.Take other medicines 2 hours apart. May discolour stools.",
  },
  {
    drugName: "CLAVULANATE 125MG, AMOXICILLIN 500MG TAB",
    pilLink: "https://www.healthhub.sg/a-z/medications/metformin",
    drugImagesLink:
      "https://www.mediview.sg/keyword/n-zXKQXN/metformin/i-x2BL3nZ/A",
    counsellingPointsText: "This is an antibiotic for infection.",
    counsellingPointsVoiceLink:
      "https://storage.cloud.google.com/magicloud-medlabel-bucket/counselling-audio/metformin.mp3",
    otherResources:
      "https://www.health.harvard.edu/blog/is-metformin-a-wonder-drug-202109222605",
    acute: true,
    chronic: false,
    auxInstruction:
      "Take with or after food. Take regularly and complete the course. Consult doctor if rashes develop.",
  },
];

const drugClassData = [
  { name: "antipyretic" },
  { name: "analgesic" },
  { name: "antihistamine" },
  { name: "sore throat" },
  { name: "antidiarrheal" },
  { name: "antibiotic" },
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
    drugClassId: 3,
  },
  {
    drugId: 3,
    drugClassId: 4,
  },
  {
    drugId: 4,
    drugClassId: 4,
  },
  {
    drugId: 5,
    drugClassId: 5,
  },
  {
    drugId: 6,
    drugClassId: 6,
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
    method: "Suck",
    unitDose: "Loz",
  },
  {
    drugId: 4,
    method: "Suck",
    unitDose: "Loz",
  },
  {
    drugId: 5,
    method: "Take",
    unitDose: "Cap",
  },
  {
    drugId: 6,
    method: "Take",
    unitDose: "Tab",
  },
];

// const userDrugData = [
//   {
//     userId: 1,
//     drugId: 1,
//     dosingInstruction: "Take 2 tablet(s) 4 times a day when required.",
//   },
//   {
//     userId: 1,
//     drugId: 2,
//     dosingInstruction: "Take 1 tablet(s) 1 times a day when required.",
//   },
//   {
//     userId: 2,
//     drugId: 3,
//     dosingInstruction: "Take 1 tablet(s) 3 times a day.",
//   },
// ];

// const usersData = [
//   {
//     email: "paloma@diamond.com",
//     name: "Paloma Diamond",
//   },
//   {
//     email: "lorelai@lynch.com",
//     name: "Lorelai Lynch",
//   },
// ];

async function main() {
  // Seed users
  // for (const user of usersData) {
  //   await prisma.user.create({
  //     data: user,
  //   });
  // }

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
  // for (const userDrug of userDrugData) {
  //   await prisma.userDrug.create({
  //     data: userDrug,
  //   });
  // }
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
