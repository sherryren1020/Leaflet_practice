(function(){

    //create map in leaflet and tie it to the div called 'theMap'
    var map = L.map('theMap').setView([42, -60], 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

    function fetchData(previousLayer=null){
        fetch(`https://opensky-network.org/api/states/all`)
        .then(function(response){
            return response.json()
        })
        .then(function(data){
        let newData = data.states.filter((state)=> state[2]=== "Canada").map(
            state => {
                return {
                            "type": "Feature",
                            "geometry": {
                                    "type": "Point",
                                    "coordinates": [state[5], state[6]]
                                },
                            "properties": {
                                "country":state[2],
                                "true_track": state[10],
                                "position":[state[5],state[6]],
                                "velocity": state[9],
                                "vertical_rate": state[11]
                            }
                        }
                }
            )

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
        if (previousLayer !== null) {
            previousLayer.clearLayers()
        }
    
        var myLayer=L.geoJSON(null,myLayerOptions)
        console.debug(newData)
        
       
        myLayer.addData(newData).addTo(map).bindPopup(function(layer){
            return `<p><label>originCountry:</label><span>${layer.feature.properties.country}</span></p>
            <p><label>coordinates:</label><span>${layer.feature.properties.position}</span></p>
            <p><label>velocity:</label><span>${layer.feature.properties.velocity}</span></p>
            <p><label>vertical rate:</label><span>${layer.feature.properties.vertical_rate}</span></p>
            `
        })
        
        setTimeout(fetchData(myLayer),10000)
        })
    }
    setTimeout(fetchData,1000)
   
})()



    