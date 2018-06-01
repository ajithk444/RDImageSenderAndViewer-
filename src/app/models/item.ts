export interface Item {
  id?: string;
  title?: string;
  date?: string;
  commentary?: string;
  diagnosed?: boolean;
  prognosis?: string;
  intensity?: string;
  adminId?: string;
  doctorId?: string;
  doctorName?: string;
  imageAddress?: string;
  imageUrl?: string;
  viewDiagnosis?: boolean;
  imageIndexes?: string[]; // array index --> storage id (0 --> OIEM, 1 --> OIED, 2 --> ODEM, 3 --> ODED)  
  patientSex?: string;
  patientBirthDate?: string;
  ethnicGroup?: string;
}

enum prognosisOptions {
  'detected',
  'undetected',
  'uncertain'
}
