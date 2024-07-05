let searchBar = document.createElement('input');
searchBar.type = 'text';
searchBar.id = 'searchBar';
searchBar.placeholder = 'Search the category...';
document.body.appendChild(searchBar);

let searchButton = document.createElement('button');
searchButton.id = 'searchButton';
searchButton.textContent = 'Go';
document.body.appendChild(searchButton);

let resultsElement = document.createElement('ul');
resultsElement.id = 'results';
document.body.appendChild(resultsElement);


let errorMessageElement = document.createElement('p');
errorMessageElement.id = 'error-message';
document.body.appendChild(errorMessageElement);

searchButton.addEventListener('click', searchBooks);
searchBar.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    searchBooks();
  }
});async function searchBooks() {
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
        if (!response.ok) {
            throw new Error('Bad Request');
        }
        const body = await response.json();
        return body;
    }   catch (error) {
        console.error(error);
        throw error;
    }
}
async function displayResults(data) {
    const resultsElement = document.getElementById('results');
    if (!resultsElement) {
        throw new Error('Results element not found');
    }
    resultsElement.textContent = '';
    if (!data || !data.works) {
        throw new Error('Invalid data');
    }
    data.works.forEach(async (result) => {

        const authors = result.authors ? result.authors.map(author => author.name).join(', ') : '';
        const resultElement = document.createElement('li');
        resultElement.textContent = `${result.title || ''} by ${authors}`;
        resultElement.id = 'resultElement';
        resultElement.dataset.bookKey = result.key; 
        resultsElement.appendChild(resultElement);

        const descriptionContainer = document.createElement('div');
        descriptionContainer.id = 'descriptionContainer';
        resultElement.appendChild(descriptionContainer);

        const descriptionElement = document.createElement('p');
        descriptionElement.id = 'descriptionElement';
        descriptionElement.textContent = 'Ops... no description available';
        descriptionElement.dataset.bookKey = result.key;
        descriptionContainer.appendChild(descriptionElement);
        descriptionContainer.style.display = 'none';

        resultElement.addEventListener('click', function(event) {
            const target = event.target;
            const clickedDescriptionContainer = target.querySelector('#descriptionContainer');
        
            if (clickedDescriptionContainer) {
                const allDescriptionContainers = document.querySelectorAll('#descriptionContainer');
                allDescriptionContainers.forEach(container => {
                    if (container !== clickedDescriptionContainer) {
                        container.style.display = 'none';
                    }
                });
        
                clickedDescriptionContainer.style.display = clickedDescriptionContainer.style.display === 'none' ? 'block' : 'none';
            }
        });

        fetchBookData(result.key).then(bookData => {
            if (!bookData) {
                console.error("fetchBookData failed");
                return;
            }
            console.log("fetchBookData success", bookData);
            const descriptionText = document.createElement('p');
            descriptionText.textContent = bookData.description.value || bookData.description;
            descriptionElement.innerHTML = '';
            descriptionElement.appendChild(descriptionText);
        }).catch(error => {
            console.error("fetchBookData failed: ", error);
        });
        });
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



