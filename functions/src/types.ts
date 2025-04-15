export interface HeartAttackPredictionInput {
  age: number;
  sex: number; // 0 = female, 1 = male
  chestPainType: number; // 1: typical angina, 2: atypical angina, 3: non-anginal pain, 4: asymptomatic
  restingBP: number;
  cholesterol: number;
  fastingBS: number; // 1: if FastingBS > 120 mg/dl, 0: otherwise
  restingECG: number; // 0: normal, 1: having ST-T wave abnormality, 2: showing probable or definite left ventricular hypertrophy
  maxHR: number;
  exerciseAngina: number; // 1 = yes, 0 = no
  oldpeak: number;
  stSlope: number; // 1: upsloping, 2: flat, 3: downsloping
} 