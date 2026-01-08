async function searchRecipes() {
    const input = document.getElementById('ingredientInput').value;
    const resultsDiv = document.getElementById('results');
    
    // Si l'utilisateur n'a rien écrit, on arrête
    if (!input) return alert("Écris un ingrédient !");

    // On vide les anciens résultats
    resultsDiv.innerHTML = '<p>Recherche en cours...</p>';

    try {
        // 1. On appelle l'API (Fetch)
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${input}`);
        const data = await response.json();

        // 2. On nettoie la zone de résultat
        resultsDiv.innerHTML = '';

        // 3. Si on trouve des repas
        if (data.meals) {
            data.meals.forEach(meal => {
                // Pour chaque recette, on crée une "carte" HTML
                const recipeCard = `
                    <div class="recipe-card" onclick="window.open('https://www.themealdb.com/meal/${meal.idMeal}', '_blank')">
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                        <h3>${meal.strMeal}</h3>
                    </div>
                `;
                resultsDiv.innerHTML += recipeCard;
            });
        } else {
            resultsDiv.innerHTML = '<p>Aucune recette trouvée... Essaie "Chicken" ou "Egg" !</p>';
        }
    } catch (error) {
        console.error(error);
        resultsDiv.innerHTML = '<p>Erreur de connexion.</p>';
    }
}