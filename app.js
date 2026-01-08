// Ingredio App - Logic

async function searchRecipes() {
    const input = document.getElementById('ingredientInput').value;
    const resultsDiv = document.getElementById('results');
    
    if (!input) return alert("Veuillez saisir au moins un ingrédient.");

    resultsDiv.innerHTML = '<p style="color:#64748B; font-size:14px;">Recherche dans la base de données...</p>';

    try {
        const cleanInput = input.replace(/\s/g, ''); 
        const response = await fetch(`https://www.themealdb.com/api/json/v2/1/filter.php?i=${cleanInput}`);
        const data = await response.json();

        resultsDiv.innerHTML = '';

        if (data.meals) {
            data.meals.forEach(meal => {
                const recipeCard = document.createElement('div');
                recipeCard.className = 'recipe-card';
                recipeCard.onclick = () => getRecipeDetails(meal.idMeal);
                
                recipeCard.innerHTML = `
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    <h3>${meal.strMeal}</h3>
                `;
                resultsDiv.appendChild(recipeCard);
            });
        } else {
            resultsDiv.innerHTML = '<p style="color:#64748B;">Aucun résultat correspondant aux critères.</p>';
        }
    } catch (error) {
        resultsDiv.innerHTML = '<p style="color:red;">Erreur de connexion au service.</p>';
    }
}

async function getRecipeDetails(id) {
    const modal = document.getElementById('recipeModal');
    const modalBody = document.getElementById('modalBody');
    const modalTitle = document.getElementById('modalTitle');

    modal.style.display = 'block';
    modalTitle.innerText = "Chargement...";
    modalBody.innerHTML = '<p>Récupération des données...</p>';

    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        const data = await response.json();
        const meal = data.meals[0];

        modalTitle.innerText = meal.strMeal;

        let ingredientsHtml = '<ul class="ingredient-list">';
        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];
            
            if (ingredient && ingredient.trim() !== "") {
                ingredientsHtml += `<li><b>${ingredient}</b> <span style="color:#64748B">(${measure})</span></li>`;
            }
        }
        ingredientsHtml += '</ul>';

        modalBody.innerHTML = `
            <img src="${meal.strMealThumb}" class="modal-img">
            
            <h3 class="section-title">Ingrédients</h3>
            ${ingredientsHtml}
            
            <h3 class="section-title">Préparation</h3>
            <p class="instructions">${meal.strInstructions}</p>
            
            <div style="margin-top:20px; text-align:right;">
                <a href="${meal.strSource}" target="_blank" style="font-size:12px; color:#3B82F6; text-decoration:none;">Voir la source originale &rarr;</a>
            </div>
        `;

    } catch (error) {
        modalBody.innerHTML = '<p>Erreur lors du chargement des détails.</p>';
    }
}

function closeModal() {
    document.getElementById('recipeModal').style.display = 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('recipeModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}