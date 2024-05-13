export interface DrugData {
  id: number;
  dosingInstruction: string;
  drug: {
    id: number;
    drugName: string;
    pilLink: string;
    drugImagesLink: string;
    counsellingPointsText: string;
    counsellingPointsVoiceLink: string;
    otherResources: string;
    acute: boolean;
    chronic: boolean;
    auxInstruction: string;
    drugClasses: DrugClassData[];
  };
}

export interface DrugClassData {
  drugClass: {
    name: string;
  };
}
