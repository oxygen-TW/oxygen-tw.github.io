let map;
    
    function initMap(userLoc, LabData) {
        console.log(userLoc);
        
        map = new google.maps.Map(document.getElementById("map"), {
            center: { lat: userLoc["lat"], lng: userLoc["lng"] },
            zoom: 15,
        });

        var userPositionIcon = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|28FF28");

        var marker = new google.maps.Marker({
            position: { lat: userLoc["lat"], lng: userLoc["lng"] },
            map: map,
            icon: userPositionIcon
        });

        var infowindow = new google.maps.InfoWindow();
        var infowindowContent = []

        var i;
        for (i = 0; i < LabData.length; i++) {
            //跳過不顯示的
            // if (!LabData[i]["visible"]) {
            //     continue;
            // }
            
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(LabData[i]["location"]["coordinates"][1], LabData[i]["location"]["coordinates"][0]),
                map: map,
            });
            
            infowindowContent.push(`<h3>${LabData[i]["name"]}</h3>
                地址：${LabData[i]["address"]}<br/>
                電話：${LabData[i]["phone"]}<br/>
                是否提供快篩服務： ${LabData[i]["rapidTest"] ? "是" : "否"}<br/>
                快篩剩餘： ${LabData[i]["rapidTestStock"]}<br/>
                最後更新：${LabData[i]["lastUpdate"]}`)

            google.maps.event.addListener(marker, 'click', (function (marker, i) {
                return function () {
                    infowindow.setContent(infowindowContent[i]);
                    infowindow.open(map, marker);
                }
            })(marker, i));
        }

        var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
            this.setZoom(15);
            google.maps.event.removeListener(boundsListener);
        });
    }
