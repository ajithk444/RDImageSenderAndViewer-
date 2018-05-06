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
}

enum prognosisOptions {
  'detected',
  'undetected',
  'uncertain'
}
