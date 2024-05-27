import prisma from "./client";

const drugData = [
  {
    drugName: "PARACETAMOL 500MG",
    pilLink: "https://www.healthhub.sg/a-z/medications/paracetamol-oral",
    drugImagesLink:
      "https://www.mediview.sg/keyword/n-zXKQXN/paracetamol/i-Nkr8kGL/A",
    counsellingPointsText:
      "This medication helps to relieve pain or fever. Do not take more than 8 tablets in a day. Do not take with other panadol/paracetamol containing products such as Anarex, Panadol Cough/Cold/Flu. Do not consume alcohol while on paracetamol.",
    auxInstruction: "Take with or without food. Do not exceed 8 in a day.",
  },
  {
    drugName: "LORATADINE 10MG TAB",
    pilLink: "https://www.healthhub.sg/a-z/medications/antihistamine-oral",
    drugImagesLink:
      "https://www.mediview.sg/keyword/n-zXKQXN/loratadine/i-TDvGj8R/A",
    counsellingPointsText:
      "This medication is for runny nose, itch or allergy.",
    auxInstruction:
      "May be taken with or without food. May affect alertness.Warning - avoid alcoholic drinks.",
  },
  {
    drugName: "DEQUALINIUM 0.25MG LOZENGES",
    pilLink: "https://www.healthhub.sg/a-z/medications/dequalinium%20lozenges",
    drugImagesLink:
      "https://www.mediview.sg/keyword/n-zXKQXN/DEQUALINIUM/i-XgDF3pw/A",
    counsellingPointsText: "This medication is for your sore throat.",
    auxInstruction:
      "May be taken with or without food. To suck and allow to dissolve slowly in the mouth.",
  },
  {
    drugName: "DIFFLAM (BENZYDAMINE 3MG) LOZENGES",
    pilLink:
      "https://polyclinic.singhealth.com.sg/Documents/SGH%20E83R0%20Benzydamine.pdf",
    drugImagesLink:
      "https://www.mediview.sg/keyword/n-zXKQXN/DIFFLAM/i-PpVVbx3/A",
    counsellingPointsText:
      "This medication is for your sore throat. The lozenge can cause numbness of tongue and throat. Avoid hot beverages at least 30mins after taking lozenge as the numbness can cause you to burn your tongue or throat.",
    auxInstruction:
      "May be taken with or without food. To suck and allow to dissolve slowly in the mouth.",
  },
  {
    drugName: "CHARCOAL 200MG CAP",
    pilLink: "https://www.healthhub.sg/a-z/medications/anti-diarrhoeal",
    drugImagesLink:
      "https://www.mediview.sg/keyword/n-zXKQXN/charcoal/i-MjjTZsn/A",
    counsellingPointsText:
      "This medication is for your diarrhea. Take half to one hour before food. Take other medicines 2 hours apart. This medication may discolour stools.",
    auxInstruction:
      "Take half to one hour before food. Take other medicines 2 hours apart. May discolour stools.",
  },
  {
    drugName: "CLAVULANATE 125MG, AMOXICILLIN 500MG TAB",
    pilLink: "https://www.healthhub.sg/a-z/medications/penicillins-oral",
    drugImagesLink:
      "https://www.mediview.sg/keyword/n-zXKQXN/AMOXICILLIN/i-Gb2ZRbP/A",
    counsellingPointsText:
      "This is an antibiotic for infection. Some side effects include nausea, vomiting, diarrhea that should be alleviated by taking after food. Take regularly and complete the course. Consult doctor if rashes develop.",
    auxInstruction:
      "Take with or after food. Take regularly and complete the course. Consult doctor if rashes develop.",
  },
];

const drugClassData = [
  { name: "fever" },
  { name: "pain" },
  { name: "runny nose" },
  { name: "sore throat" },
  { name: "diarrhea" },
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
    method: "TAKE",
    unitDose: "TAB",
  },
  {
    drugId: 2,
    method: "TAKE",
    unitDose: "TAB",
  },
  {
    drugId: 3,
    method: "SUCK",
    unitDose: "LOZ",
  },
  {
    drugId: 4,
    method: "SUCK",
    unitDose: "LOZ",
  },
  {
    drugId: 5,
    method: "TAKE",
    unitDose: "CAP",
  },
  {
    drugId: 6,
    method: "TAKE",
    unitDose: "TAB",
  },
];

async function main() {
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
