(function(){

    //create map in leaflet and tie it to the div called 'theMap'
    var map = L.map('theMap').setView([42, -60], 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

    // L.marker([42, -60]).addTo(map)
    //     .bindPopup('This is a sample popup. You can put any html structure in this including extra flight data. You can also swap this icon out for a custom icon. Some png files have been provided for you to use if you wish.')
    //     .openPopup();

    
    // var plane = L.icon({
    //     iconUrl:'plane.svg',
    //     iconSize:[38,95]
    // })
    
    
      
      // create the GeoJSON layer
    // 
         function fetchData(){
            var data
           fetch(`https://opensky-network.org/api/states/all`)
        .then(function(response){
            return response.json()
        })
        .then(function(data){
           let newData = data.states.filter((state)=> state[2]=== "Canada").map(state=>{
              return {
                "type": "Feature",
                "geometry": {
                  "type": "Point",
                  "coordinates": [state[5], state[6]]
                },
                "properties": {
                    "country":state[2],
                    "true_track": state[10],
                    "position":[state[5],state[6]]
                    


                } 
            }
         })

         function createCustomIcon (feature, latlng) {
            let myIcon = L.icon({
                iconUrl: 'plane3.png',
                iconSize:     [25, 25], 
                popupAnchor:  [0, 0] 
            })
            return L.marker(latlng, { icon: myIcon, rotationAngle:feature.properties.true_track})
          }
          
          // create an options object that specifies which function will called on each feature
          let myLayerOptions = {
            pointToLayer: createCustomIcon
          }
    
          var myLayer=L.geoJSON(null,myLayerOptions)
        console.log(newData) 
        myLayer.clearLayers()
        console.log(myLayer)
        myLayer.addData(newData).addTo(map).bindPopup(function(layer){
            return `I am origin from ${layer.feature.properties.country},</br> And my position is ${layer.feature.properties.position}`
        })
       
        //  myLayer.addData(newData,myLayerOptions).addTo(map)
        setTimeout(fetchData,4000)

        
        
        })
    }
    setTimeout(fetchData,4000)
   
    
    
   
    
    

    


})()



    