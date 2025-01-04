# Jira Goal Progress Predictor

A Forge app that enhances Jira issues with machine learning-powered goal progress prediction. This application integrates directly with Jira to analyze goal progress and predict whether projects are at risk based on current progress metrics and delay indicators.

## Features

- Real-time goal progress tracking
- ML-powered risk assessment
- Custom Jira field integration
- Automated progress status predictions
- Label-based delay detection

## Technical Overview

The application consists of two main components:

### 1. Forge Extension (index.js)
- Implements a Forge resolver for handling data fetching and ML integration
- Interfaces with Jira's REST API to retrieve issue data
- Manages communication between Jira and the ML model
- Handles error cases and provides fallback values

### 2. Machine Learning Model (issueDExt.py)
- Implements a Random Forest Classifier for risk prediction
- Processes progress and delay indicators
- Returns binary classification (At Risk/On Track)

## Setup Requirements

1. Jira instance with administrator access
2. Forge CLI installed
3. Python 3.x with scikit-learn
4. Custom fields configured in Jira:
   - customfield_12345 (Goal Name)
   - customfield_67890 (Progress)

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   pip install scikit-learn numpy
   ```
3. Deploy to Forge:
   ```bash
   forge deploy
   ```

## Configuration

1. Set up custom fields in Jira
2. Configure ML model parameters in `issueDExt.py`
3. Update field IDs in `index.js` if needed

## Limitations

- Currently uses a simplified ML model for demonstration
- Requires "Delayed" label for delay detection
- Training data is mocked (should be replaced with real historical data)

## Contributing

Feel free to submit issues and enhancement requests. Pull requests are welcome.

## License

GPU v3.0 License - See LICENSE file for details
