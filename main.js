// Use o evento "submit" do formulário para ativar a pesquisa quando Enter é pressionado
document.getElementById('searchForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Impede o envio do formulário padrão
    searchGitHub();
});

// Atualize o evento de clique do botão de pesquisa
document.getElementById('searchButton').addEventListener('click', function () {
    searchGitHub();
});

// Atualize o evento de clique dos botões de organização
document.getElementById('sortByStars').addEventListener('click', function () {
    sortResults('stargazers_count');
});

document.getElementById('sortByWatchers').addEventListener('click', function () {
    sortResults('watchers_count');
});

// Mantenha a função de pesquisa em uma função separada para reutilização
function searchGitHub() {
    const searchInput = document.getElementById('searchInput').value;
    const resultsContainer = document.getElementById('results');

    // Clear previous search results
    resultsContainer.innerHTML = '';

    // Make a request to GitHub API
    fetch(`https://api.github.com/search/repositories?q=${searchInput}`)
        .then(response => response.json())
        .then(data => {
            data.items.forEach(repository => {
                const repositoryElement = document.createElement('div');
                repositoryElement.classList.add('repository-item');
                repositoryElement.setAttribute('data-watchers_count', repository.watchers_count);
                repositoryElement.setAttribute('data-stargazers_count', repository.stargazers_count);
                repositoryElement.innerHTML = `
                    <h2>${repository.full_name}</h2>
                    <p>${repository.description}</p>
                    <p>URL: <a href="${repository.html_url}" target="_blank">${repository.html_url}</a></p>
                    <p>Watchers: ${repository.watchers_count}</p>
                    <p>Stars: ${repository.stargazers_count}</p>
                    <p>Issues: ${repository.open_issues_count}</p>
                `;
                resultsContainer.appendChild(repositoryElement);
            });
        })
        .catch(error => console.error('Error:', error));
}

// Mantenha a função de classificação como antes
function sortResults(sortKey) {
    const resultsContainer = document.getElementById('results');
    const repositoryItems = Array.from(document.querySelectorAll('.repository-item'));

    repositoryItems.sort((a, b) => {
        const aData = a.getAttribute(`data-${sortKey}`);
        const bData = b.getAttribute(`data-${sortKey}`);

        return bData - aData;
    });

    resultsContainer.innerHTML = '';
    repositoryItems.forEach(item => {
        resultsContainer.appendChild(item);
    });
}
