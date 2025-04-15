import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Load and parse the dataset
const datasetPath = path.join(process.cwd(), 'public', 'predictions', 'data.csv');
const dataset = fs.readFileSync(datasetPath, 'utf-8')
  .split('\n')
  .slice(1) // Skip header
  .filter(line => line.trim())
  .map(line => {
    const [
      patientNumber,
      bloodPressureAbnormality,
      hemoglobin,
      geneticCoefficient,
      age,
      bmi,
      gender,
      pregnancy,
      smoking,
      physicalActivity,
      saltContent,
      alcoholConsumption,
      stressLevel,
      kidneyDisease,
      thyroidDisorders
    ] = line.split(',').map(Number);
    return {
      bloodPressureAbnormality,
      hemoglobin,
      geneticCoefficient,
      age,
      bmi,
      gender,
      pregnancy,
      smoking,
      physicalActivity,
      saltContent,
      alcoholConsumption,
      stressLevel,
      kidneyDisease,
      thyroidDisorders
    };
  });

// Calculate similarity score between input and dataset entries
function calculateSimilarity(input: any, datasetEntry: any): number {
  const weights = {
    age: 0.1,
    bmi: 0.1,
    gender: 0.05,
    smoking: 0.05,
    physicalActivity: 0.1,
    saltContent: 0.1,
    alcoholConsumption: 0.1,
    stressLevel: 0.1,
    kidneyDisease: 0.05,
    thyroidDisorders: 0.05
  };

  let score = 0;
  
  // Age similarity (normalized difference)
  const ageDiff = Math.abs(input.age - datasetEntry.age);
  const ageSimilarity = 1 - (ageDiff / Math.max(input.age, datasetEntry.age));
  score += ageSimilarity * weights.age;

  // BMI similarity
  const bmiDiff = Math.abs(input.bmi - datasetEntry.bmi);
  const bmiSimilarity = 1 - (bmiDiff / Math.max(input.bmi, datasetEntry.bmi));
  score += bmiSimilarity * weights.bmi;

  // Gender similarity (exact match)
  if (input.gender === datasetEntry.gender) {
    score += weights.gender;
  }

  // Smoking similarity (exact match)
  if (input.smoking === datasetEntry.smoking) {
    score += weights.smoking;
  }

  // Physical activity similarity
  const paDiff = Math.abs(input.physicalActivity - datasetEntry.physicalActivity);
  const paSimilarity = 1 - (paDiff / Math.max(input.physicalActivity, datasetEntry.physicalActivity));
  score += paSimilarity * weights.physicalActivity;

  // Salt content similarity
  const saltDiff = Math.abs(input.saltIntake - datasetEntry.saltContent);
  const saltSimilarity = 1 - (saltDiff / Math.max(input.saltIntake, datasetEntry.saltContent));
  score += saltSimilarity * weights.saltContent;

  // Alcohol consumption similarity
  const alcDiff = Math.abs(input.alcohol - datasetEntry.alcoholConsumption);
  const alcSimilarity = 1 - (alcDiff / Math.max(input.alcohol, datasetEntry.alcoholConsumption));
  score += alcSimilarity * weights.alcoholConsumption;

  // Stress level similarity
  const stressDiff = Math.abs(input.stressLevel - datasetEntry.stressLevel);
  const stressSimilarity = 1 - (stressDiff / Math.max(input.stressLevel, datasetEntry.stressLevel));
  score += stressSimilarity * weights.stressLevel;

  return score;
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Convert form data to match dataset format
    const inputData = {
      age: Number(data.age),
      bmi: Number(data.bmi),
      gender: data.gender === 'male' ? 1 : 0,
      smoking: data.smoking === 'yes' ? 1 : 0,
      physicalActivity: data.physicalActivity === 'low' ? 10000 : data.physicalActivity === 'moderate' ? 30000 : 50000,
      saltIntake: data.saltIntake === 'low' ? 10000 : data.saltIntake === 'moderate' ? 30000 : 50000,
      alcohol: data.alcohol === 'yes' ? 100 : 0,
      stressLevel: data.stressLevel === 'low' ? 1 : data.stressLevel === 'moderate' ? 2 : 3,
      kidneyDisease: data.familyHistory === 'yes' ? 1 : 0,
      thyroidDisorders: 0 // Default to no thyroid disorders
    };
    
    // Find most similar entries in dataset
    const similarities = dataset.map(entry => ({
      similarity: calculateSimilarity(inputData, entry),
      hasAbnormality: entry.bloodPressureAbnormality === 1
    }));

    // Sort by similarity and take top 10
    similarities.sort((a, b) => b.similarity - a.similarity);
    const topMatches = similarities.slice(0, 10);

    // Calculate prediction based on top matches
    const abnormalityCount = topMatches.filter(match => match.hasAbnormality).length;
    const prediction = abnormalityCount / topMatches.length;

    // Determine risk level
    let riskLevel = 'Low';
    if (prediction > 0.7) {
      riskLevel = 'High';
    } else if (prediction > 0.3) {
      riskLevel = 'Moderate';
    }

    // Determine blood pressure status
    let bloodPressureStatus = 'Normal';
    if (prediction > 0.7) {
      bloodPressureStatus = 'Stage 2 Hypertension';
    } else if (prediction > 0.5) {
      bloodPressureStatus = 'Stage 1 Hypertension';
    } else if (prediction > 0.3) {
      bloodPressureStatus = 'Elevated';
    }

    return NextResponse.json({ 
      prediction: bloodPressureStatus,
      riskLevel,
      confidence: Math.abs(prediction - 0.5) * 2,
      matches: topMatches.length,
      dataset: 'Blood Pressure Dataset'
    });
  } catch (error) {
    console.error('Error in blood pressure prediction:', error);
    return NextResponse.json(
      { error: 'Failed to process prediction request' },
      { status: 500 }
    );
  }
} 