import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Load and parse the dataset
const datasetPath = path.join(process.cwd(), 'public', 'predictions', 'anemia.csv');
const dataset = fs.readFileSync(datasetPath, 'utf-8')
  .split('\n')
  .slice(1) // Skip header
  .filter(line => line.trim())
  .map(line => {
    const [gender, hemoglobin, mch, mchc, mcv, result] = line.split(',').map(Number);
    return { gender, hemoglobin, mch, mchc, mcv, result };
  });

// Calculate similarity score between input and dataset entries
function calculateSimilarity(input: any, datasetEntry: any): number {
  const weights = {
    gender: 0.1,
    hemoglobin: 0.3,
    mch: 0.2,
    mchc: 0.2,
    mcv: 0.2
  };

  let score = 0;
  
  // Gender similarity (exact match)
  if (input.gender === datasetEntry.gender) {
    score += weights.gender;
  }

  // Hemoglobin similarity (normalized difference)
  const hbDiff = Math.abs(input.hemoglobin - datasetEntry.hemoglobin);
  const hbSimilarity = 1 - (hbDiff / Math.max(input.hemoglobin, datasetEntry.hemoglobin));
  score += hbSimilarity * weights.hemoglobin;

  // MCH similarity
  const mchDiff = Math.abs(input.mch - datasetEntry.mch);
  const mchSimilarity = 1 - (mchDiff / Math.max(input.mch, datasetEntry.mch));
  score += mchSimilarity * weights.mch;

  // MCHC similarity
  const mchcDiff = Math.abs(input.mchc - datasetEntry.mchc);
  const mchcSimilarity = 1 - (mchcDiff / Math.max(input.mchc, datasetEntry.mchc));
  score += mchcSimilarity * weights.mchc;

  // MCV similarity
  const mcvDiff = Math.abs(input.mcv - datasetEntry.mcv);
  const mcvSimilarity = 1 - (mcvDiff / Math.max(input.mcv, datasetEntry.mcv));
  score += mcvSimilarity * weights.mcv;

  return score;
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Find most similar entries in dataset
    const similarities = dataset.map(entry => ({
      similarity: calculateSimilarity(data, entry),
      hasAnemia: entry.result === 1
    }));

    // Sort by similarity and take top 10
    similarities.sort((a, b) => b.similarity - a.similarity);
    const topMatches = similarities.slice(0, 10);

    // Calculate prediction based on top matches
    const anemiaCount = topMatches.filter(match => match.hasAnemia).length;
    const prediction = anemiaCount / topMatches.length;

    return NextResponse.json({ 
      prediction,
      riskLevel: prediction > 0.5 ? 'High' : 'Low',
      confidence: Math.abs(prediction - 0.5) * 2,
      matches: topMatches.length,
      dataset: 'Anemia Dataset'
    });
  } catch (error) {
    console.error('Error in anemia prediction:', error);
    return NextResponse.json(
      { error: 'Failed to process prediction request' },
      { status: 500 }
    );
  }
} 