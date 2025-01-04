import React, { useEffect, useState } from 'react';
import { invoke } from '@forge/bridge'; // Import the bridge module for invoking backend functions

function GoalSyncApp() {
  // State to hold the data fetched from the backend
  const [goalData, setGoalData] = useState({
    goalName: 'Loading...',
    progress: '0%',
    labels: [],
  });

  // Fetch data from the backend resolver when the component mounts
  useEffect(() => {
    const fetchGoalData = async () => {
      try {
        // Use invoke to call the backend resolver function 'fetchGoalData'
        const data = await invoke('fetchGoalData');
        setGoalData(data); // Update state with the fetched data
      } catch (error) {
        console.error('Error fetching goal data:', error);
        setGoalData({
          goalName: 'Error',
          progress: 'N/A',
          labels: ['Failed to load data'],
        });
      }
    };

    fetchGoalData();
  }, []);

  return (
    <div style={{ padding: '10px', fontFamily: 'Arial, sans-serif' }}>
      <h1>GoalSync Panel</h1>
      <h2>Goal: {goalData.goalName}</h2>
      <p>Progress: {goalData.progress}</p>
      <h3>Labels:</h3>
      <ul>
        {goalData.labels.length > 0 ? (
          goalData.labels.map((label, index) => <li key={index}>{label}</li>)
        ) : (
          <li>No labels available</li>
        )}
      </ul>
    </div>
  );
}

export default GoalSyncApp;
