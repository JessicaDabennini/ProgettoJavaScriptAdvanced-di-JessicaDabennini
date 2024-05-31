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

let errorMessageElement = document.createElement('p');
errorMessageElement.id = 'error-message';
document.body.appendChild(errorMessageElement);

document.getElementById('searchButton').addEventListener('click', searchBooks);
async function searchBooks() {
    try {
        const categoryValue = await getSearchBarValue();
        const data = await fetchSubjectData(categoryValue);
         displayResults(data);
    } catch (error) {
        displayErrorMessage(error);
    }
}
function getSearchBarValue() {
    return new Promise((resolve, reject) => {
        const category = document.getElementById('searchBar');
        if (!category) {
            reject(new Error('Search bar not found'));
            return;
        }

        const categoryValue = category.value.trim();
        if (!categoryValue) {
            reject(new Error('Category value is empty'));
            return;
        }

        resolve(categoryValue);
    });
}

function fetchSubjectData(categoryValue) {
    return new Promise((resolve, reject) => {
        fetch(`https://openlibrary.org/subjects/${categoryValue}.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => resolve(data))
            .catch(error => reject(new Error(`Error fetching subject data: ${error.message}`)));
    });
}

async function fetchBookData(bookKey) {
    try {
        const response = await fetch(`https://openlibrary.org/books/${bookKey}.json`);
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        return response.json();
    } catch (error) {
        throw new Error(`Error fetching book data: ${error.message}`);
    }
}

function displayResults(data) {
    const resultsElement = document.getElementById('results');
    if (!resultsElement) {
        throw new Error('Results element not found');
    }
    resultsElement.innerHTML = '';

    if (!data ||!data.works) {
        throw new Error('Invalid data');
    }

    

    data.works.forEach(result => {
        const authors = result.authors? result.authors.map(author => author.name).join(', ') : '';
        const resultElement = document.createElement('li');
        resultElement.textContent = `${result.title || ''} by ${authors}`;
        resultElement.id = 'resultElement';
        resultsElement.appendChild(resultElement);

        resultElement.addEventListener('click', async function() {
            try {
                const bookKey = result.key;
                if (!bookKey) {
                    throw new Error('Book key not found');
                }

                const bookData = await fetchBookData(bookKey);
                const categoryValue = await getSearchBarValue();
                const subjectData = await fetchSubjectData(categoryValue);
                await displayDescription(bookData, subjectData);
            } catch (error) {
                displayErrorMessage(error);
            }
        });
    });
}



async function displayDescription(bookData, subjectData) {
    const descriptionContainer = document.getElementById('description-container');
    if (!descriptionContainer) {
        throw new Error('Description container not found');
    }

    descriptionContainer.innerHTML = '';

    if (!subjectData || !subjectData.description) {
        throw new Error('Description not found');
    }

    const description = subjectData.description;
    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = description;
    descriptionContainer.appendChild(descriptionElement);
}


   

// document.querySelector("#contentBody > div.workDetails > div.editionAbout > div.book-description.read-more.read-more--expanded > div")
// #contentBody 
// //*[@id="contentBody"]
//read-more__content                        