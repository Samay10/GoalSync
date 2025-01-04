import { Resolver } from '@forge/bridge';
import api, { route } from '@forge/api';
import { execFile } from 'child_process';
import path from 'path';

const resolver = new Resolver();

// Helper function to call the ML model
const runMLModel = (inputData) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, 'ml', 'isseDExt.py'); // Path to the ML model script
    const child = execFile('python', [scriptPath], { input: JSON.stringify(inputData) }, (error, stdout, stderr) => {
      if (error) {
        console.error('Error executing ML script:', error);
        reject(stderr || error.message);
      } else {
        resolve(JSON.parse(stdout));
      }
    });
  });
};

// Define the resolver to fetch goal data from Jira and run ML predictions
resolver.define('fetchGoalData', async (req) => {
  const issueKey = req.context.extension.issue.key; // Retrieve the issue key from the request context
  console.log('Fetching data for issue:', issueKey); // Log the issue key for debugging

  try {
    // Make an API call to Jira to fetch custom goal-related fields (goal name, progress, and labels)
    const res = await api.asUser().requestJira(route`/rest/api/3/issue/${issueKey}?fields=customfield_12345,customfield_67890,labels`);
    console.log('Jira API Response:', res); // Log the response from the Jira API

    if (!res.ok) {
      console.warn(`Failed to fetch data for issue ${issueKey}: ${res.status}`);
      return { goalName: 'Error', progress: '0%', labels: [], mlPrediction: 'Error' };
    }

    // Parse the response to JSON
    const data = await res.json();
    console.log('Fetched Data:', data); // Log the data for debugging purposes

    // Extract the goal-related fields
    const goalName = data.fields.customfield_12345 || 'No Goal Set'; // Fallback if goal name is missing
    const progress = data.fields.customfield_67890 || '0'; // Fallback if progress is missing
    const labels = data.fields.labels || []; // Fallback if labels are missing

    // Prepare input for ML model
    const mlInput = {
      progress: parseInt(progress, 10), // Ensure progress is a number
      isDelayed: labels.includes('Delayed') ? 1 : 0, // Example: check if 'Delayed' label exists
    };

    // Run the ML model
    const mlResult = await runMLModel(mlInput);
    console.log('ML Prediction:', mlResult); // Log the ML prediction

    // Return the goal data along with the ML prediction
    return {
      goalName,
      progress: `${progress}%`,
      labels,
      mlPrediction: mlResult.prediction === 1 ? 'At Risk' : 'On Track',
    };
  } catch (error) {
    console.error(`Error fetching goal data for issue ${issueKey}:`, error);
    return { goalName: 'Error', progress: '0%', labels: [], mlPrediction: 'Error' };
  }
});

// Export the resolver definitions, which will be used by Forge for the panel behavior
export const handler = resolver.getDefinitions();
