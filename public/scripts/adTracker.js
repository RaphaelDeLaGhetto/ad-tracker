(function() {
  var PROXY_URL = '';
  var AD_SERVER = '/';

  fetch(PROXY_URL + AD_SERVER + 'next').then(function(response) {
    return response.json();
  }).then(function(json) {
    if (Object.keys(json).length > 0) {

      // code here to use the dimensions
      var button = document.createElement('button');
      button.style.backgroundImage = `url(${json.image})`;
      button.style.width = '100%';
      button.style.height = '100%';
      button.style.backgroundColor = '#000000';
      button.style.backgroundRepeat = 'no-repeat';
      button.style.backgroundSize = 'contain';
      button.style.backgroundPosition = 'center';
  
      var anchor = document.createElement('a');
      anchor.setAttribute('href', `${AD_SERVER}count?dest=${encodeURIComponent(json.destination)}`);
      anchor.appendChild(button);
  
      var adDiv = document.querySelector('.ad-tracker');
      adDiv.style.width = `${((adDiv.offsetHeight > 0 ? adDiv.offsetHeight : 1) * json.width) / (adDiv.offsetWidth > 0 ? adDiv.offsetWidth : 1)}px`;
      adDiv.style.height = `${((adDiv.offsetWidth > 0 ? adDiv.offsetWidth : 1) * json.height) / (adDiv.offsetHeight > 0 ? adDiv.offsetHeight : 1)}px`;
      adDiv.appendChild(anchor);
      document.dispatchEvent(new Event('ad-tracker-done'));
    }
  });
})();
