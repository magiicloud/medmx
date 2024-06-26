export interface UserDrugData {
  id: number;
  dosingInstruction: string;
  drug: DrugData;
}

export interface DrugData {
  id: number;
  drugName: string;
  pilLink: string;
  drugImagesLink: string;
  counsellingPointsText: string;
  auxInstruction: string;
  drugClasses: DrugClassData[];
}

export interface DrugClassData {
  drugClass: {
    name: string;
  };
}

export interface ScheduleData {
  id: number;
  userDrugId: number;
  morning: boolean;
  afternoon: boolean;
  evening: boolean;
  night: boolean;
  userDrug: {
    dosingInstruction: string;
    drug: {
      drugName: string;
      drugClasses: DrugClassData[];
      auxInstruction: string;
    };
  };
}
