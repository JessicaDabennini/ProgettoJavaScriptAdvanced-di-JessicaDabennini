/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ (() => {

eval("let searchBar = document.createElement('input');\nsearchBar.type = 'text';\nsearchBar.id = 'searchBar';\nsearchBar.placeholder = 'Search the category...';\ndocument.body.appendChild(searchBar);\n\nlet searchButton = document.createElement('button');\nsearchButton.id = 'searchButton';\nsearchButton.textContent = 'Go';\ndocument.body.appendChild(searchButton);\n\nlet resultsElement = document.createElement('ul');\nresultsElement.id = 'results';\ndocument.body.appendChild(resultsElement);\n\n\nlet errorMessageElement = document.createElement('p');\nerrorMessageElement.id = 'error-message';\ndocument.body.appendChild(errorMessageElement);\n\nsearchButton.addEventListener('click', searchBooks);\nsearchBar.addEventListener('keydown', (e) => {\n  if (e.key === 'Enter') {\n    searchBooks();\n}\n});\n\nasync function searchBooks() {\n    const categoryValue = await getSearchBarValue().catch(displayErrorMessage);\n    if (!categoryValue) return;\n    const data = await fetchSubjectData(categoryValue).catch(displayErrorMessage);\n    if (!data) return;\n    displayResults(data);\n}\n\nconst getSearchBarValue = () => document.getElementById('searchBar')?.value.trim() || Promise.reject(new Error('Search bar not found'));\n\nasync function fetchSubjectData(categoryValue) {\n  const url = `https://openlibrary.org/subjects/${categoryValue}.json`;\n  const response = await fetch(url);\n  if (!response.ok) throw new Error('Bad Request');\n  return await response.json();\n}\n\nconst loadingBar = document.getElementById('loading-bar');\n\nasync function searchBooks() {\n  try {\n    loadingBar.style.display = 'block';\n\n    const categoryValue = await getSearchBarValue();\n    const data = await fetchSubjectData(categoryValue);\n    displayResults(data);\n\n    loadingBar.style.display = 'none';\n  } catch (error) {\n    displayErrorMessage(error);\n    loadingBar.style.display = 'none';\n  }\n}\n\nasync function displayResults(data) {\n  const resultsElement = document.getElementById('results');\n  if (!resultsElement) throw new Error('Results element not found');\n  resultsElement.textContent = '';\n  if (!data || !data.works) throw new Error('Invalid data');\n\n  const promises = data.works.map(result => {\n    const authors = result.authors ? result.authors.map(author => author.name).join(', ') : '';\n    const resultElement = document.createElement('li');\n    resultElement.textContent = `${result.title || ''} by ${authors}`;\n    resultElement.id = 'resultElement';\n    resultElement.dataset.bookKey = result.key;\n    resultsElement.appendChild(resultElement);\n\n    const descriptionContainer = document.createElement('div');\n    descriptionContainer.id = 'descriptionContainer';\n    resultElement.appendChild(descriptionContainer);\n\n    const descriptionElement = document.createElement('p');\n    descriptionElement.id = 'descriptionElement';\n    descriptionElement.textContent = 'Ops... no description available';\n    descriptionElement.dataset.bookKey = result.key;\n    descriptionContainer.appendChild(descriptionElement);\n    descriptionContainer.style.display = 'none';\n\n    resultElement.addEventListener('click', toggleDescription);\n\n    return fetchBookData(result.key).then(bookData => {\n      if (bookData) {\n        const descriptionText = document.createElement('p');\n        const description = bookData?.description?.value || bookData?.description;\n        if (description) {\n          descriptionText.textContent = description;\n          descriptionElement.textContent = '';\n        }\n        descriptionElement.appendChild(descriptionText);\n      }\n    });\n  });\n\n  await Promise.all(promises);\n}\n\nfunction toggleDescription(event) {\n  const target = event.target;\n  const clickedDescriptionContainer = target.querySelector('#descriptionContainer');\n\n  if (clickedDescriptionContainer) {\n    const allDescriptionContainers = document.querySelectorAll('#descriptionContainer');\n    allDescriptionContainers.forEach(container => {\n      if (container !== clickedDescriptionContainer) {\n        container.style.display = 'none';\n      }\n    });\n\n    clickedDescriptionContainer.style.display =\n      clickedDescriptionContainer.style.display === 'none' ? 'block' : 'none';\n  }\n}\n\nasync function fetchBookData(bookKey) {\n  try {\n    const response = await fetch(`https://openlibrary.org${bookKey}.json`);\n    if (response.status === 303) {\n      const newUrl = response.headers.get('Location');\n      const newResponse = await fetch(newUrl);\n      const data = await newResponse.json();\n      return data;\n    } else if (!response.ok) {\n      throw new Error('Failed to fetch book data');\n    }\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error('Error fetching book data:', error);\n    return null;\n  }\n}\n\n\n\n\n\n//# sourceURL=webpack://my-webpack-project/./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/index.js"]();
/******/ 	
/******/ })()
;