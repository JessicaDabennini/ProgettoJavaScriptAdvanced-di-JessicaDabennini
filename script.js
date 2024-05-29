let searchBar = document.createElement('input');
searchBar.type = 'text';
searchBar.id = 'searchBar';
searchBar.placeholder = 'Search...';
document.body.appendChild(searchBar);

let searchButton = document.createElement('button');
searchButton.id = 'searchButton';
searchButton.textContent = 'Go';
document.body.appendChild(searchButton);

let resultsElement = document.createElement('ul');
resultsElement.id = 'results';
document.body.appendChild(resultsElement);

let descriptionContainer = document.createElement('div');
descriptionContainer.id = 'description-container';
document.body.appendChild(descriptionContainer);

document.getElementById('searchButton').addEventListener('click', searchBooks);

function searchBooks() {
    let category = document.getElementById('searchBar');
    if (!category) {
        console.error('Search bar not found');
        return;
    }

    let categoryValue = category.value;
    if (!categoryValue) {
        console.error('Category value is empty');
        return;
    }

    fetch(`https://openlibrary.org/subjects/${categoryValue}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            let resultsElement = document.getElementById('results');
            if (!resultsElement) {
                console.error('Results element not found');
                return;
            }
            resultsElement.innerHTML = '';
            data.works.forEach(result => {
                let authors = result.authors.map(author => author.name).join(', ');
                let resultElement = document.createElement('li');
                resultElement.textContent = `${result.title} by ${authors}`;
                resultElement.id = 'resultElement';
                resultsElement.appendChild(resultElement);

                resultElement.addEventListener('click', function() {
                    const bookKey = result.key;
                    if (!bookKey) {
                        console.error('Book key not found');
                        return;
                    }

                    fetch(`https://openlibrary.org/books/${bookKey}.json`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`Error: ${response.statusText}`);
                            }
                            return response.json();
                        })
                        .then(() => {
                            return fetch(`https://openlibrary.org/subjects/${categoryValue}.json`)
                                .then(response => {
                                    if (!response.ok) {
                                        throw new Error(`Error: ${response.statusText}`);
                                    }
                                    return response.json();
                                });
                        })
                        .then(subjectData => {
                            const description = subjectData.description;
                            if (!description) {
                                console.error('Description not found');
                                return;
                            }
                            let descriptionElement = document.createElement('p');
                            descriptionElement.innerHTML = description;
                            let descriptionContainer = document.getElementById('description-container');
                            if (!descriptionContainer) {
                                console.error('Description container not found');
                                return;
                            }
                            descriptionContainer.appendChild(descriptionElement);
                        })
                        .catch(error => console.log(error));
                });
            });
        })
        .catch(error => console.log(error));
}


// document.querySelector("#contentBody > div.workDetails > div.editionAbout > div.book-description.read-more.read-more--expanded > div")
// #contentBody > div.workDetails > div.editionAbout > div.book-description.read-more.read-more--expanded > div
// //*[@id="contentBody"]/div[1]/div[3]/div[4]/div
// <div class="read-more__content" 

//                         read-more__content