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

  function checkForNewItems() {
    const url = 'https://retail.tigerapps.org/items/get_relative/?count=10&direction=backward&base_item_pk=-1&search_string=&condition_indexes=&category_pks=&sort_type=';
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const maxPk = Math.max(...data.map(item => item.pk));
        if (lastMaxPk === null || maxPk > lastMaxPk) {
          // New item found, change icon color
          chrome.action.setIcon({ path: 'icon_new_item.png' });
          lastMaxPk = maxPk;
        } else {
          // No new item, reset icon color
          chrome.action.setIcon({ path: 'tigericon32.png' });
        }
      })
      .catch(error => console.error('Error:', error));
  }
  
  // Poll every 2 minutes
  setInterval(checkForNewItems, 2 * 60 * 1000);
  
  // Initial check
  checkForNewItems();
  