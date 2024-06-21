import './style.css';

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

async function fetchSubjectData(categoryValue) {
    try {
        if (!categoryValue) {
            throw new Error('Category value is empty');
        }
        const response = await fetch(`https://openlibrary.org/subjects/${categoryValue}.json`);
        console.log(response);
        if (!response.ok) {
            throw new Error('Bad Request');
        }
        const body = await response.json();
        return body;
    }   catch (error) {
        console.error(error);
    }
}

async function displayResults(data) {
    const resultsElement = document.getElementById('results');
    if (!resultsElement) {
        throw new Error('Results element not found');
    }
    resultsElement.innerHTML = '';
    if (!data || !data.works) {
        throw new Error('Invalid data');
    }
}

async function fetchBookData(bookKey) {
  try {
    const response = await fetch(`https://openlibrary.org${bookKey}.json`);
    if (response.status === 303) {
      const newUrl = response.headers.get('Location');
      const newResponse = await fetch(newUrl);
      const data = await newResponse.json();
      return data;
    } else if (!response.ok) {
      throw new Error('Failed to fetch book data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching book data:', error);
    return null;
  }
}

async function searchBooks() {
    try {
        const categoryValue = await getSearchBarValue();
        const data = await fetchSubjectData(categoryValue);
        displayResults(data);
        data.works.forEach(async (result) => {
            const authors = result.authors ? result.authors.map(author => author.name).join(', ') : '';
            const resultElement = document.createElement('li');
            resultElement.textContent = `${result.title || ''} by ${authors}`;
            resultElement.id = 'resultElement';
            resultElement.dataset.bookKey = result.key; 
            resultsElement.appendChild(resultElement);
    
        });
    } catch (error) {
        displayErrorMessage(error);
        console.error("Error: ", error);
    }
}

 resultsElement.addEventListener('click', ResultClick);

function ResultClick (event) {
    if (!event || !event.target) {
        console.error("ResultClick called with invalid event or target");
        return;
    }
    const target = event.target;
    if (target.id !== 'resultElement') {
        console.log("target.id is not 'resultElement'");
        return;
    }
    const bookKey = target.dataset.bookKey;
    if (!bookKey) {
        console.error("bookKey is not defined");
        return;
    }
    fetchBookData(bookKey).then(bookData => {
        if (!bookData) {
            console.error("fetchBookData failed");
            return;
        }
        console.log("fetchBookData success", bookData);
        descriptionContainer.innerHTML = '';
        const descriptionElement = document.createElement('p');
        descriptionElement.id = 'descriptionElement';
        descriptionElement.textContent = bookData.description.value || bookData.description;
        descriptionElement.dataset.bookKey = bookKey;
        descriptionContainer.appendChild(descriptionElement);
    }).catch(error => {
        console.error("fetchBookData failed: ", error);
    });
}

