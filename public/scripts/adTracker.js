(function() {
  var adDiv = document.querySelector('.ad-tracker');
  fetch(AD_SERVER + 'next').then(function(response) {
    return response.json();
  }).then(function(json) {
    if (Object.keys(json) > 0) {
      var anchor = document.createElement('a');
      anchor.setAttribute('href', json.destination);
  
      var img = document.createElement('img');
      img.setAttribute('src', json.imageLg);
  
      anchor.append(img);
      adDiv.append(anchor);
    }
  });
})();
