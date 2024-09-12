const searchInput = document.querySelector('#search');
const resultsDiv = document.querySelector('.results');
var device = "";
if (window.innerWidth < 768) {
    device = "mobile";
  } else {
    device = "desktop or tab";
  }

//prevent form submit
document.getElementById("serch_form").addEventListener("submit", function(event) {
    event.preventDefault();
  });

// add event listener to search input
searchInput.addEventListener('input', debounce(search, 300));

searchInput.addEventListener('focus', function() {
    this.classList.remove("search_icon");
    this.style.width = "80%";
  });

searchInput.addEventListener("blur", function() {
    if (this.value.trim() == "") {
        this.classList.add("search_icon");
        device == "mobile" ? this.style.width = "30%" : this.style.width = "15%";
      }
  });



  function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

function search() {
    const query = searchInput.value.trim();
    if (query.length > 0) {
        fetch(`searchBooks.php?query=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(data => displayResults(data))
            .catch(error => console.error('Error fetching data: ', error));
    } else {
        resultsDiv.innerHTML = '';
    }
}

function displayResults(data) {
    resultsDiv.innerHTML = ''; // Clear previous results
    if (data.length > 0) {
        const list = document.createElement('ol');
        data.forEach(book => {
            // const item = document.createElement('li');
            // item.textContent = `${book.book_name} - ${book.author_name}`;
            // list.appendChild(item);
            const item = document.createElement('li');
    
            // Create text node for book name
            const textNode = document.createTextNode(`${book.book_name} - `);
            
            // Create span for author name
            const authorSpan = document.createElement('span');
            authorSpan.className = 'author';
            authorSpan.textContent = `${book.author_name} (row id - ${book.id})`;
            
            // Append book name and author span to the list item
            item.appendChild(textNode);
            item.appendChild(authorSpan);
            
            // Finally, append the item to the list
            list.appendChild(item);
        });
        resultsDiv.appendChild(list);
    } else {
        resultsDiv.innerHTML = '<p>No results found</p>';
    }
}
