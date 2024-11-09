chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.contentScriptQuery === "fetchUrl") {
      fetch(request.url)
        .then(response => response.text()) // Assuming the response is text
        .then(text => sendResponse({ content: text }))
        .catch(error => console.error('Error:', error));
      return true; // Indicates that sendResponse will be called asynchronously
    }
});
let lastMaxPk = null;
let previousItems = []; // Store previously fetched items
let hasNewItems = false; // Flag to track if there are new items

function checkForNewItems() {
  console.log('checkForNewItems called');
  console.log('Starting fetch for new items...');
  const url = 'https://retail.tigerapps.org/items/get_relative/?count=10&direction=backward&base_item_pk=-1&search_string=&condition_indexes=&category_pks=&sort_type=';
  
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Response data:', data);
      const items = data.items || []; // Use an empty array if items is undefined

      // Check if items is an array
      if (!Array.isArray(items)) {
        console.warn('Expected data.items to be an array, but got:', items);
        return; // Exit the function if items is not an array
      }

      // Check for new items
      const newItems = items.filter(item => !previousItems.some(prevItem => prevItem.pk === item.pk));

      if (newItems.length > 0) {
        console.log('New items detected:', newItems);
        hasNewItems = true; // Set the flag to true
        // Change the icon to indicate new items
        chrome.action.setIcon({ path: 'icon_new_item.png' }); // Update with your new icon path
      } else {
        console.log('No new items detected.');
        hasNewItems = false; // Reset the flag
        // Reset to the default icon if no new items
        chrome.action.setIcon({ path: 'tigericon32.png' }); // Set the default icon
      }

      // Update the previous items to the current items
      previousItems = items;
    })
    .catch(error => console.error('Error:', error));
}

// Add a listener for clicks on the extension icon
chrome.action.onClicked.addListener(() => {
  console.log('Extension icon clicked. Resetting to default icon.');
  // Reset to the default icon
  chrome.action.setIcon({ path: 'tigericon32.png' }); // Reset to the default icon
  hasNewItems = false; // Reset the flag when clicked
});

// Optionally, you can call checkForNewItems at intervals
setInterval(checkForNewItems, 60000); // Check every 60 seconds (1 minute)

checkForNewItems();
