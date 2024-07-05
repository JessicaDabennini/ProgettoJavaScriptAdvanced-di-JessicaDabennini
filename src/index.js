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
});

async function searchBooks() {
    const categoryValue = await getSearchBarValue().catch(displayErrorMessage);
    if (!categoryValue) return;
    const data = await fetchSubjectData(categoryValue).catch(displayErrorMessage);
    if (!data) return;
    displayResults(data);
}

const getSearchBarValue = () => document.getElementById('searchBar')?.value.trim() || Promise.reject(new Error('Search bar not found'));

async function fetchSubjectData(categoryValue) {
  const url = `https://openlibrary.org/subjects/${categoryValue}.json`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Bad Request');
  return await response.json();
}

const loadingBar = document.getElementById('loading-bar');

async function searchBooks() {
  try {
    loadingBar.style.display = 'block';

    const categoryValue = await getSearchBarValue();
    const data = await fetchSubjectData(categoryValue);
    displayResults(data);

    loadingBar.style.display = 'none';
  } catch (error) {
    displayErrorMessage(error);
    loadingBar.style.display = 'none';
  }
}

async function displayResults(data) {
  const resultsElement = document.getElementById('results');
  if (!resultsElement) throw new Error('Results element not found');
  resultsElement.textContent = '';
  if (!data || !data.works) throw new Error('Invalid data');

  const promises = data.works.map(result => {
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

    resultElement.addEventListener('click', toggleDescription);

    return fetchBookData(result.key).then(bookData => {
      if (bookData) {
        const descriptionText = document.createElement('p');
        descriptionText.textContent = bookData.description.value || bookData.description;
        descriptionElement.textContent = '';
        descriptionElement.appendChild(descriptionText);
      }
    });
  });

  await Promise.all(promises);
}

function toggleDescription(event) {
  const target = event.target;
  const clickedDescriptionContainer = target.querySelector('#descriptionContainer');

  if (clickedDescriptionContainer) {
    const allDescriptionContainers = document.querySelectorAll('#descriptionContainer');
    allDescriptionContainers.forEach(container => {
      if (container !== clickedDescriptionContainer) {
        container.style.display = 'none';
      }
    });

    clickedDescriptionContainer.style.display =
      clickedDescriptionContainer.style.display === 'none' ? 'block' : 'none';
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



