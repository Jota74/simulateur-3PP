// Fonction pour vérifier et colorer le contour de la date de naissance
function checkDateValidity() {
    const dateInput = document.getElementById('dateNaissance');
    if (dateInput.validity.valid) {
        dateInput.style.borderColor = '#4caf50'; // Couleur verte si la date est valide
    } else {
        dateInput.style.borderColor = '#e57373'; // Couleur rouge si la date n'est pas valide
    }
}

// Écouteur d'événement pour la date de naissance
document.getElementById('dateNaissance').addEventListener('input', checkDateValidity);

// Fonction pour gérer la sélection des options
document.querySelectorAll('.choice').forEach(choice => {
    choice.addEventListener('click', () => {
        const type = choice.getAttribute('data-type');
        document.querySelectorAll(`[data-type="${type}"]`).forEach(c => c.classList.remove('selected'));
        choice.classList.add('selected');
        calculateCapital(); // Mettre à jour les calculs après chaque choix
    });
});

// Fonction pour mettre à jour l'affichage du slider
const updateDisplay = (slider, display, min, step) => {
    let value = Math.max(1, parseInt(slider.value)); // 1 est le minimum du slider pour correspondre à 100 CHF
    let displayValue = min + (value - 1) * step;
    display.textContent = `${displayValue} CHF / mois`;
};

// Fonction pour calculer le capital au moment de la retraite
const calculateCapital = () => {
    const age = parseInt(document.getElementById('ageSlider').value);
    const yearsTo65 = 65 - age;
    const monthlySavings = parseInt(document.getElementById('savingsSlider').value) * 50 + 100; // Assume que la valeur du slider commence à 1 pour 100 CHF

    if (isNaN(monthlySavings) || isNaN(yearsTo65)) {
        // Afficher des valeurs par défaut si les données sont invalides
        document.getElementById('capital-display').querySelector('strong').textContent = '0 CHF';
        document.getElementById('annual-tax-savings').querySelector('strong').textContent = '0 CHF';
        document.getElementById('tax-savings').querySelector('strong').textContent = '0 CHF';
        document.getElementById('total-capital').querySelector('strong').textContent = '0 CHF';
        return;
    }

    let capital = 0;
    const annualInterestRate = 0.06; // Taux d'intérêt annuel de 6%
    for (let i = 0; i < yearsTo65; i++) {
        capital = (capital + monthlySavings * 12) * (1 + annualInterestRate); 
    }

    // Calcul de l'économie d'impôt annuelle
    const annualTaxSaving = monthlySavings * 12 * 0.27; // Taux d'imposition de 27%

    // Arrondir et afficher sans décimales
    document.getElementById('capital-display').querySelector('strong').textContent = Math.round(capital).toLocaleString('fr-CH') + ' CHF';
    document.getElementById('annual-tax-savings').querySelector('strong').textContent = Math.round(annualTaxSaving).toLocaleString('fr-CH') + ' CHF';
    const totalTaxSaving = annualTaxSaving * yearsTo65;
    document.getElementById('tax-savings').querySelector('strong').textContent = Math.round(totalTaxSaving).toLocaleString('fr-CH') + ' CHF';
    const total = capital + totalTaxSaving;
    document.getElementById('total-capital').querySelector('strong').textContent = Math.round(total).toLocaleString('fr-CH') + ' CHF';
};

// Écouteurs pour les sliders
document.getElementById('ageSlider').oninput = function() {
    document.getElementById('age-display').textContent = `${this.value} ans`;
    calculateCapital();
};

document.getElementById('savingsSlider').oninput = function() {
    updateDisplay(this, document.getElementById('savings-display'), 100, 50);
    calculateCapital();
};

// Écouteur pour le bouton de demande d'offre
document.getElementById('request-offer-button').addEventListener('click', () => {
    alert('Votre demande d\'offre pour un capital de ' + document.getElementById('total-capital').querySelector('strong').textContent + ' a été envoyée!');
});