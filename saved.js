function deleteSummary(summaryId) {
    chrome.storage.sync.get('summaries', function(data) {
      var summaries = data.summaries || [];
      var newSummaries = summaries.filter(function(summary) {
        return summary.id !== summaryId;
      });
      chrome.storage.sync.set({summaries: newSummaries}, function() {
        console.log('Summary deleted:', summaryId);
        // Update the list of saved summaries in the popup
        updateSavedSummaries();
      });
    });
  }
  
  function updateSavedSummaries() {
    chrome.storage.sync.get('summaries', function(data) {
      var summaries = data.summaries || [];
      var list = document.getElementById('saved-summaries');
      list.innerHTML = '';
      for (var i = 0; i < summaries.length; i++) {
        var item = document.createElement('li');
        var summaryText = summaries[i].text;
        item.appendChild(document.createTextNode(summaryText));
        var deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.setAttribute('data-summary-id', summaries[i].id);
        deleteButton.addEventListener('click', function() {
          var summaryId = this.getAttribute('data-summary-id');
          deleteSummary(summaryId);
          this.parentNode.remove();
        });
        item.appendChild(deleteButton);
        list.appendChild(item);
      }
    });
  }
  
  chrome.storage.sync.get('summaries', function(data) {
    console.log(data);
    var summaries = data.summaries || [];
    var list = document.getElementById('saved-summaries');
    for (var i = 0; i < summaries.length; i++) {
      var item = document.createElement('li');
      item.appendChild(document.createTextNode(summaries[i].text));
      list.appendChild(item);
    }
    document.querySelector('.close-button').addEventListener('click', function() {
      window.close();
    });
  
    updateSavedSummaries();
  });
  