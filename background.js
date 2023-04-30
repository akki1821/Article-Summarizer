chrome.storage.sync.get('summaries', function(data) {
    var summaries = data.summaries || [];
    console.log(summaries);
 
  
  chrome.storage.sync.set({ summaries: summaries }, function() {
    // data has been saved, trigger the notification after 1 second
    setTimeout(function() {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/notification.png',
        title: 'Summary Saved',
        message: 'Your summary has been saved successfully.'
      });
    }, 500);
  });
});