// Navbar toggle functionality
let menu = document.querySelector('#menu-btn');
let navbar = document.querySelector('.navbar');

// Toggle the menu and navbar visibility when clicking the menu button
menu.onclick = () => {
    menu.classList.toggle('fa-times'); // Add or remove the 'fa-times' class
    navbar.classList.toggle('active'); // Add or remove the 'active' class
};

// Reset the menu and navbar state when scrolling
window.onscroll = () => {
    menu.classList.remove('fa-times'); // Remove the 'fa-times' class
    navbar.classList.remove('active'); // Remove the 'active' class
};

// Data Structure: Using Hash Table to store disease probabilities based on symptoms
const symptomDiseaseMap = new Map([
    ["Fever", new Map([["Flu", 0.7], ["Malaria", 0.2], ["Dengue", 0.1], ["Typhoid", 0.3], ["Influenza", 0.6]])],
    ["Cough", new Map([["Flu", 0.6], ["Cold", 0.4], ["Bronchitis", 0.5], ["Influenza", 0.7]])],
    ["Headache", new Map([["Migraine", 0.8], ["Flu", 0.2], ["Tension Headache", 0.5], ["Sinusitis", 0.6]])],
    ["Fatigue", new Map([["Anemia", 0.7], ["Flu", 0.4], ["Chronic Fatigue Syndrome", 0.8], ["Hypothyroidism", 0.5]])],
    ["Thirst", new Map([["Diabetes", 1.0], ["Dehydration", 0.9]])],
    ["Chills", new Map([["Flu", 0.7], ["Malaria", 0.8], ["Influenza", 0.9]])],
    ["Dizziness", new Map([["Vertigo", 0.8], ["Anemia", 0.7], ["Low Blood Pressure", 0.5]])],
    ["Nausea", new Map([["Gastritis", 0.6], ["Food Poisoning", 0.5], ["Flu", 0.4], ["Pregnancy", 0.7]])],
    ["Sore Throat", new Map([["Cold", 0.6], ["Flu", 0.7], ["Strep Throat", 0.8], ["Mononucleosis", 0.6]])]
]);

// Function to diagnose disease based on input symptoms
function diagnose() {
    const input = document.getElementById('symptom-input').value; // Get user input
    if (!input) {
        // Show an error if input is empty
        document.getElementById('diagnosis-result').innerHTML = `<strong>Please enter symptoms.</strong>`;
        return;
    }

    const symptoms = input.toLowerCase().split(',').map(s => s.trim()); // Normalize and split symptoms
    const diseaseScores = new Map();

    // Brute force matching of symptoms to calculate disease probabilities
    for (const symptom of symptoms) {
        for (const [key, diseases] of symptomDiseaseMap) {
            if (key.toLowerCase() === symptom) { // Match symptoms case-insensitively
                for (const [disease, probability] of diseases) {
                    // Calculate cumulative probability scores
                    diseaseScores.set(disease, (diseaseScores.get(disease) || 1) * probability);
                }
            }
        }
    }

    // Normalize probability scores to percentages
    const totalScore = Array.from(diseaseScores.values()).reduce((a, b) => a + b, 0);
    for (const [disease, score] of diseaseScores.entries()) {
        diseaseScores.set(disease, ((score / totalScore) * 100).toFixed(2) + '%');
    }

    // Display the results
    const resultElement = document.getElementById('diagnosis-result');
    if (diseaseScores.size > 0) {
        resultElement.innerHTML = "<strong>Possible Diseases:</strong><br><table class='result-table'><tr><th>Disease</th><th>Probability</th></tr>" +
            Array.from(diseaseScores.entries())
            .map(([disease, prob]) => `<tr><td>${disease}</td><td>${prob}</td></tr>`)
            .join('') + "</table>";
        document.getElementById('result-box').style.display = 'block'; // Show result box
    } else {
        resultElement.innerText = "No diseases found for the given symptoms.";
    }
}

// Data Structure: Using Hash Table to store drug probabilities based on diseases
const diseaseDrugMap = new Map([
    ["Flu", new Map([["Paracetamol", 0.8], ["Ibuprofen", 0.7], ["Vitamin C", 0.6], ["Cough Syrup", 0.9], ["Zinc Supplements", 0.7]])],
    ["Cold", new Map([["Cough Syrup", 0.7], ["Vitamin C", 0.8], ["Zinc", 0.6], ["Saline Nasal Spray", 0.7]])],
    ["Migraine", new Map([["Aspirin", 0.9], ["Ibuprofen", 0.8], ["Triptans", 0.9], ["Acetaminophen", 0.7]])],
    ["Diabetes", new Map([["Metformin", 1.0], ["Insulin", 1.0], ["Glipizide", 0.9], ["Sitagliptin", 0.8]])],
    ["Bronchitis", new Map([["Bronchodilators", 0.8], ["Cough Syrup", 0.7], ["Antibiotics", 0.9]])],
    ["Gastritis", new Map([["Antacids", 0.8], ["Proton Pump Inhibitors", 0.9], ["Antibiotics", 0.7]])],
    ["Tension Headache", new Map([["Acetaminophen", 0.8], ["Ibuprofen", 0.7], ["Relaxation Techniques", 0.9]])],
    ["Dehydration", new Map([["Oral Rehydration Salts", 1.0], ["Electrolyte Solutions", 0.9], ["Water", 0.8]])],
    ["Anemia", new Map([["Iron Supplements", 0.9], ["Vitamin B12", 0.8], ["Folic Acid", 0.7]])],
    ["Influenza", new Map([["Rest", 1.0], ["Hydration", 1.0], ["Paracetamol", 0.8], ["Antivirals", 0.7]])]
]);

// Function to recommend drugs based on the disease input
function recommendDrugs() {
    let disease = document.getElementById('disease-input').value.trim().toLowerCase(); // Get and normalize user input
    disease = disease.charAt(0).toUpperCase() + disease.slice(1); // Capitalize the first letter

    const drugScores = diseaseDrugMap.get(disease); // Retrieve drug data

    if (!drugScores) {
        // Show an error if no drugs are found
        document.getElementById('drug-result').innerText = "No recommendations available for the given disease.";
        return;
    }

    // Normalize drug scores to percentages
    const totalScore = Array.from(drugScores.values()).reduce((a, b) => a + b, 0);
    const normalizedDrugs = new Map();
    for (const [drug, score] of drugScores.entries()) {
        normalizedDrugs.set(drug, ((score / totalScore) * 100).toFixed(2) + '%');
    }

    // Display the results
    const resultElement = document.getElementById('drug-result');
    resultElement.innerHTML = "<strong>Recommended Drugs:</strong><br><table class='result-table'><tr><th>Drug</th><th>Probability</th></tr>" +
        Array.from(normalizedDrugs.entries())
        .map(([drug, prob]) => `<tr><td>${drug}</td><td>${prob}</td></tr>`)
        .join('') + "</table>";
    document.getElementById('result-box').style.display = 'block'; // Show result box
}


// BMI Calculator
// Store BMI calculation history in an array
let bmiHistory = [];

// Define BMI categories and their descriptions using an object for O(1) lookup
const bmiCategories = {
    underweight: 'Underweight (BMI < 18.5)',
    normal: 'Normal weight (BMI 18.5 - 24.9)',
    overweight: 'Overweight (BMI 25 - 29.9)',
    obesity: 'Obesity (BMI >= 30)'
};

/*
 * Initialize the BMI calculator functionality
 * Sets up event listeners and form handling
 */
function initializeBMICalculator() {
    // Get reference to the BMI form
    const bmiForm = document.getElementById('bmiForm');
    
    // Check if form exists to prevent errors
    if (bmiForm) {
        // Add submit event listener to the form
        bmiForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent form submission
            
            // Get and parse weight and height values from inputs
            const weight = parseFloat(document.getElementById('weight').value);
            const heightInCm = parseFloat(document.getElementById('height').value);
            
            // Validate inputs are positive numbers
            if (weight <= 0 || heightInCm <= 0) {
                alert('Please enter positive values for weight and height.');
                return;
            }
            
            // Convert height to meters for BMI calculation
            const height = heightInCm / 100;
            
            // Calculate BMI using the formula
            const bmi = (weight / (height * height)).toFixed(2);
            
            // Determine BMI category based on calculated value
            let category;
            if (bmi < 18.5) {
                category = bmiCategories.underweight;
            } else if (bmi < 24.9) {
                category = bmiCategories.normal;
            } else if (bmi < 29.9) {
                category = bmiCategories.overweight;
            } else {
                category = bmiCategories.obesity;
            }
            
            // Display result to user
            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = `Your BMI is <strong>${bmi}</strong><br>${category}`;
            
            // Add calculation to history
            bmiHistory.push({
                weight,
                heightInCm,
                bmi,
                category,
                date: new Date() // Add timestamp
            });
            
            // Update history display
            updateBMIHistoryUI();
        });
    }
}

/*
 * Update the BMI history table
 * Sorts entries by date and displays them in the table
 */
function updateBMIHistoryUI() {
    // Get reference to table body
    const historyBody = document.getElementById('historyBody');
    if (!historyBody) return; // Exit if table doesn't exist
    
    // Clear existing table content
    historyBody.innerHTML = '';
    
    // Sort history by date (newest first) and create table rows
    bmiHistory
        .sort((a, b) => b.date - a.date)
        .forEach(record => {
            // Create new table row
            const row = document.createElement('tr');
            // Populate row with record data
            row.innerHTML = `
                <td>${record.weight}</td>
                <td>${record.heightInCm}</td>
                <td>${record.bmi}</td>
                <td>${record.category}</td>
                <td>${record.date.toLocaleString()}</td>
            `;
            // Add row to table
            historyBody.appendChild(row);
        });
}

// Initialize BMI calculator when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeBMICalculator();
});


// Diabetes Risk
// Define RiskNode class to handle risk classification for different health factors
class RiskNode {
    // Constructor to initialize risk thresholds for a health factor
    constructor(value, lowThreshold, highThreshold) {
        this.value = value;                    
        this.lowThreshold = lowThreshold;      
        this.highThreshold = highThreshold;    
    }

    // Method to classify a given input value into risk categories
    classify(inputValue) {
        // If value is below lowThreshold, risk is low
        if (inputValue < this.lowThreshold) {
            return "low";
        // If value is below highThreshold but above lowThreshold, risk is moderate
        } else if (inputValue < this.highThreshold) {
            return "moderate";
        // If value is above highThreshold, risk is high
        } else {
            return "high";
        }
    }
}

// Define risk thresholds for each health factor based on medical guidelines
const riskTree = {
    age: new RiskNode("age", 35, 50),              
    bmi: new RiskNode("bmi", 25, 30),             
    glucose: new RiskNode("glucose", 100, 125),   
    bloodPressure: new RiskNode("bloodPressure", 120, 140),  
};

// Create a directed graph showing relationships between risk factors
const riskGraph = new Map();
// Glucose levels influence BMI and blood pressure
riskGraph.set("glucose", ["bmi", "bloodPressure"]);
// BMI is influenced by glucose and age
riskGraph.set("bmi", ["glucose", "age"]);
// Blood pressure is influenced by age
riskGraph.set("bloodPressure", ["age"]);
// Age has no dependencies
riskGraph.set("age", []);

// Define numerical scores for risk levels to enable comparisons
const riskScores = {
    low: 0,       
    moderate: 1,   
    high: 2      
};

/*
 * Calculate the highest risk level among given factors using a greedy approach
 * @param {Array} factors - Array of health factors to evaluate
 * @returns {string} - Highest risk level found ("low", "moderate", or "high")
 */
function greedyHighestRisk(factors) {
    // Initialize with lowest risk level
    let highestRisk = "low";

    // Evaluate each factor
    factors.forEach(factor => {
        // Get the input value from the corresponding form field
        const inputValue = parseFloat(document.getElementById(`diabetes-${factor}`).value);
        
        // Validate input value
        if (isNaN(inputValue)) {
            console.error(`Invalid value for ${factor}`);
            return;
        }
        
        // Classify the current factor's risk level
        const currentRisk = riskTree[factor].classify(inputValue);
        
        // Update highestRisk if current factor has higher risk score
        if (riskScores[currentRisk] > riskScores[highestRisk]) {
            highestRisk = currentRisk;
        }
    });

    return highestRisk;
}

/*
 * Calculate overall diabetes risk based on all factors and their relationships
 * Considers both direct risk factors and influenced factors
 */
function calculateDiabetesRisk() {
    // Define all risk factors to evaluate
    const factors = ["age", "bmi", "glucose", "bloodPressure"];
    // Get factors influenced by glucose levels
    const influencedFactors = riskGraph.get("glucose") || [];

    // Calculate highest risk among all direct factors
    const directRiskCategory = greedyHighestRisk(factors);
    // Calculate highest risk among factors influenced by glucose
    const influencedRiskCategory = greedyHighestRisk(influencedFactors);

    // Determine final risk category based on combined risk scores
    // High risk if combined score >= 3, otherwise moderate risk
    const finalRisk =
        riskScores[directRiskCategory] + riskScores[influencedRiskCategory] >= 3
            ? "High Risk"
            : "Moderate Risk";

    // Get result display element
    const resultDiv = document.getElementById("diabetes-result");
    // Make result visible
    resultDiv.style.display = "block";
    
    // Apply appropriate styling based on risk level
    resultDiv.className = 'result ' + 
        (finalRisk === "High Risk" ? "high-risk" : "moderate-risk");
    
    // Display formatted result to user
    resultDiv.innerHTML = `
        <h3>Risk Assessment Results</h3>
        <p><strong>Risk Category:</strong> ${finalRisk}</p>
        <p>Please consult with a healthcare professional for a complete evaluation.</p>
    `;
}

// Initialize event listeners when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get reference to diabetes assessment form
    const diabetesForm = document.getElementById('diabetesForm');
    
    // Add form submission handler if form exists
    if (diabetesForm) {
        diabetesForm.addEventListener('submit', (e) => {
            e.preventDefault();  // Prevent default form submission
            calculateDiabetesRisk();  // Calculate and display risk assessment
        });
    }
});
