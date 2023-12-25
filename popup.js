document.addEventListener('DOMContentLoaded', function() {
    chrome.runtime.sendMessage(
      {
        contentScriptQuery: "fetchUrl",
        url: 'https://retail.tigerapps.org/items/get_relative/?count=10&direction=backward&base_item_pk=-1&search_string=&condition_indexes=&category_pks=&sort_type='
      },
      response => {
        try {
          const jsonResponse = JSON.parse(response.content);
  
          // Check if the jsonResponse contains 'items' and it's an array
          if (jsonResponse && Array.isArray(jsonResponse.items)) {
            const contentDiv = document.getElementById('content');
            jsonResponse.items.forEach(item => {
              const itemContainer = document.createElement('div'); // Container for each item
              itemContainer.style.marginBottom = '10px'; // Add some spacing between items
  
              const name = item.name; // assuming 'name' is the correct field
              const price = item.price; // assuming 'price' is the correct field
              const imageUrl = item.image; // assuming 'image' contains the URL
              const pk = item.pk; // assuming 'pk' is the unique identifier
  
              // Construct the URL using the 'pk' value
              const itemUrl = `https://retail.tigerapps.org/items/${pk}/page/`;
  
              // Create an anchor element for the item name
              const nameLink = document.createElement('a');
              nameLink.href = itemUrl;
              nameLink.textContent = name;
              nameLink.target = "_blank"; // Open in a new tab
              itemContainer.appendChild(nameLink);
  
              // Create a paragraph element for price
              const pricePara = document.createElement('p');
              pricePara.textContent = `Price: ${price}`;
              itemContainer.appendChild(pricePara);
  
              // Create an image element and set its source
              const image = document.createElement('img');
              image.src = imageUrl;
              image.alt = `Image of ${name}`;
              image.style.maxWidth = '300px'; // Set a max width for the image
              itemContainer.appendChild(image);
  
              // Append the item container to the content div
              contentDiv.appendChild(itemContainer);
            });
          } else {
            console.error('Unexpected JSON structure:', jsonResponse);
          }
        } catch (e) {
          console.error('Error parsing JSON:', e);
        }
      }
    );
  });
  