document.addEventListener('DOMContentLoaded', function() {

  function highlightSentences(summary) {
    // Split the summary into individual sentences
    var sentences = summary.split(". ");
  
    // Calculate the score for each sentence based on its length and position in the summary
    var scores = sentences.map(function(sentence, index) {
      var lengthScore = sentence.length / summary.length;
      var positionScore = index / sentences.length;
      return lengthScore + positionScore;
    });
  
    // Find the top 3 sentences with the highest scores
    var topSentences = [];
    for (var i = 0; i < 3; i++) {
      var maxScore = Math.max(...scores);
      var maxIndex = scores.indexOf(maxScore);
      topSentences.push(sentences[maxIndex]);
      scores[maxIndex] = 0;
    }
  
    // Highlight the top sentences in the summary text
    var summaryText = document.getElementById('summary-text');
    topSentences.forEach(function(sentence) {
      var regex = new RegExp(sentence, 'g');
      summaryText.innerHTML = summaryText.innerHTML.replace(regex, '<span class="highlight">' + sentence + '</span>');
    });
  }
  
 
 
 
  function summarizeArticle() {
    console.log("Button clicked");
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var tab = tabs[0];
      var url = tab.url;

      var numSentences = document.getElementById('num-sentences').value;

  
      var apiUrl = `https://api.meaningcloud.com/summarization-1.0?key=208591479ed031f6dae537c824385bfd&url=${encodeURIComponent(url)}&sentences=${numSentences}`;
  
      fetch(apiUrl, {
        mode: 'cors'
      })
      .then(response => {
        console.log(response);
        return response.json();
      })
      .then(data => {
        console.log(data);
        var summary = data.summary;

        document.getElementById('summary-text').textContent = summary;
        highlightSentences(summary); })
      .catch(error => console.log(error));
    });
  }
  
  function saveSummary() {
    var summary = document.getElementById('summary-text').textContent;
    var summaryId = Date.now().toString();
    var summaryObj = {id: summaryId, text: summary};
  
    chrome.storage.sync.get('summaries', function(data) {
      var summaries = data.summaries || [];
      summaries.push(summaryObj);
      chrome.storage.sync.set({summaries: summaries}, function() {
        console.log('Summary saved:', summaryObj);
      });
    });
  }
  

  
  document.getElementById('summarize-btn').addEventListener('click', function() {
    summarizeArticle();
  });

  document.getElementById('save-btn').addEventListener('click', function() {
    saveSummary();
  });

  document.addEventListener('DOMContentLoaded', function() {
    chrome.tabs.executeScript({
      code: 'document.body.style.backgroundColor = "red";'
    });
    chrome.storage.sync.get('summaries', function(data) {
      var summaries = data.summaries || [];
      var list = document.getElementById('saved-summaries');
      for (var i = 0; i < summaries.length; i++) {
        var item = document.createElement('li');
        item.appendChild(document.createTextNode(summaries[i]));
        list.appendChild(item);
      }
    });
  });
  
  document.getElementById('show-saved').addEventListener('click', function() {
    chrome.tabs.create({url: 'saved.html'});
  });

  document.getElementById('share-button').addEventListener('click', function() {
  // Get the saved summaries from chrome storage
  chrome.storage.sync.get('summaries', function(data) {
    var summaries = data.summaries || [];

    // Use the Web Share API to share the summaries
    navigator.share({
      title: 'My saved summaries',
      text: summaries.join('\n\n'),
    })
    .then(() => console.log('Summary shared successfully.'))
    .catch((error) => console.error('Error sharing summary:', error));
  });
});



});
