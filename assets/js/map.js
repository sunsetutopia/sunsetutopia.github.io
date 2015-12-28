---
---

//map
var JekyllMaps = function () {
  this.map;
  this.postdata = {
    type: 'FeatureCollection',
    features: [
      {% for post in site.posts %}
        {% if post.loc %}{% assign plng = [post.loc] %}{% assign plat = [post.loc] %}{% endif %}
        {% if post.lng and post.lat %}{% assign plng = post.lng %}{% assign plat = post.lat %}{% endif %}
        {% if plng and plat %}{
          'type': 'Feature',
          'properties': {
            {% for p in post.properties %}
            '{{ p.key }}': '{{ p.value }}',{% endfor %}
          },
          'geometry': {
            'type': 'Point',
            'coordinates': [ {{ plng }}, {{ plat }}]
          }
        },{% endif %}
      {% endfor %}
    ]
  };

  this._createMap();
}


function onEachPostFeature(feature, layer) {
  // does this feature have a property named popupContent?
  if (feature.properties && feature.properties.popupContent) {
    layer.bindPopup(feature.properties.popupContent);
  }
}

JekyllMaps.prototype._createMap = function() {
  this.map = L.map( 'map' ).setView( [0, 0], 1 );
  L.tileLayer( '{{ site.map-tileset }}', {
    attribution: '{{ site.map-credits }}'
  }).addTo(this.map);
  this.geojson = L.geoJson(this.postdata, {
    onEachFeature: onEachPostFeature
  }).addTo(this.map);
  this.map.fitBounds(this.geojson.getBounds());
}
