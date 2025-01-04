import sys
import json
from sklearn.ensemble import RandomForestClassifier
import numpy as np

# Example ML model: Random Forest for classification
def predict_progress(data):
    try:
        # Mock training data (replace with real training process or a saved model)
        X_train = np.array([[10, 1], [50, 1], [90, 0]])  # [progress, isDelayed]
        y_train = np.array([0, 1, 1])  # Labels: 0 = On track, 1 = At risk

        # Model training (for simplicity, train on every call)
        clf = RandomForestClassifier()
        clf.fit(X_train, y_train)

        # Parse input data
        progress = data.get("progress", 0)
        is_delayed = data.get("isDelayed", 0)
        X_test = np.array([[progress, is_delayed]])

        # Predict
        prediction = clf.predict(X_test)
        return {"status": "success", "prediction": int(prediction[0])}

    except Exception as e:
        return {"status": "error", "message": str(e)}

# Read input data from command line
if __name__ == "__main__":
    input_data = json.loads(sys.stdin.read())
    result = predict_progress(input_data)
    print(json.dumps(result))
