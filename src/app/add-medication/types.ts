export interface OcrData {
  data: {
    msg: string;
    status: string;
    data: {
      drugName: string;
      dosingInstruction: string;
    };
  };
}

export interface DrugData {
  id: number;
  drugName: string;
  dosingInstruction: string;
}

export interface SubmittedData {
  userId: string;
  drugId: number;
  dosingInstruction: string;
}

export interface UserJobsData {
  id: number;
  jobId: string;
  drugName: string;
  dosingInstruction: string;
}
