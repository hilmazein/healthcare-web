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
