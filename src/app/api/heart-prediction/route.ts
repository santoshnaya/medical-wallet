import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Load and parse the dataset
const datasetPath = path.join(process.cwd(), 'public', 'heart+disease', 'processed.cleveland.data');
const dataset = fs.readFileSync(datasetPath, 'utf-8')
  .split('\n')
  .filter(line => line.trim())
  .map(line => line.split(',').map(Number));

// Calculate similarity score between input and dataset entries
function calculateSimilarity(input: number[], datasetEntry: number[]): number {
  let score = 0;
  const weights = [0.1, 0.1, 0.15, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.05];
  
  for (let i = 0; i < input.length; i++) {
    const diff = Math.abs(input[i] - datasetEntry[i]);
    const normalizedDiff = diff / (Math.max(input[i], datasetEntry[i]) || 1);
    score += (1 - normalizedDiff) * weights[i];
  }
  
  return score;
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Convert form data to array format matching dataset
    const inputData = [
      Number(data.age),
      Number(data.sex),
      Number(data.chestPainType),
      Number(data.restingBP),
      Number(data.cholesterol),
      Number(data.fastingBS),
      Number(data.restingECG),
      Number(data.maxHR),
      Number(data.exerciseAngina),
      Number(data.oldpeak)
    ];

    // Find most similar entries in dataset
    const similarities = dataset.map(entry => ({
      similarity: calculateSimilarity(inputData, entry.slice(0, -1)),
      hasDisease: entry[entry.length - 1] > 0
    }));

    // Sort by similarity and take top 10
    similarities.sort((a, b) => b.similarity - a.similarity);
    const topMatches = similarities.slice(0, 10);

    // Calculate prediction based on top matches
    const diseaseCount = topMatches.filter(match => match.hasDisease).length;
    const prediction = diseaseCount / topMatches.length;

    return NextResponse.json({ 
      prediction,
      riskLevel: prediction > 0.5 ? 'High' : 'Low',
      confidence: Math.abs(prediction - 0.5) * 2,
      matches: topMatches.length,
      dataset: 'Cleveland Heart Disease Dataset'
    });
  } catch (error) {
    console.error('Error in heart prediction:', error);
    return NextResponse.json(
      { error: 'Failed to process prediction request' },
      { status: 500 }
    );
  }
} 