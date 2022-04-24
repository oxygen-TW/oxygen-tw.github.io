var x = document.getElementById("pos");
var userLoc;
var nearLab;

var points = [
    { lat: -35.1827, lng: 149.07279 },
    { lat: -33.51359, lng: 151.1240 },
    { lat: -37.4849, lng: 144.5747 }
]

async function HTTPFetch() {
    axios.get('http://140.114.188.165:5000/fetchAll').then(resp => {
        console.log("Promise ok");
        LabData = resp.data;
        console.log(LabData);
        getLocation(LabData);
    }, function (error) {
        console.log(error);
        alert("取得檢驗所資料失敗，嘗試重新整理頁面或聯絡開發人員");
    });
}


async function fetchNearLab(_lng, _lat) {
    let payload = { lng: _lng, lat: _lat, limit: 3 };
    let res;
    try {
        res = await axios.post('http://140.114.188.165:5000/fetchNear', payload);
    } catch (error) {
        alert("取得鄰近檢驗所時發生錯誤");
        console.log(error);
    }

    nearLab = res.data;
    console.log(res.data);

    console.log(nearLab);
    var i=0;
    if (nearLab != undefined) {
        $("#nearlab_card").empty();
        while (nearLab.length > (i)) {
            var comment = '<div class="card" style="margin: 3px 8px 3px auto"><div class="card-body"><h5>'+nearLab[i]["name"]+'</h5><p>地址：' + nearLab[i]["address"] + '</p><p>電話：' + nearLab[i]["phone"] + '</p><p>是否提供快篩服務：' + nearLab[i]["rapidTest"] + '</p><p>快篩剩餘：' + nearLab[i]["rapidTestStock"] + '</p></div></div>';
            $("#nearlab_card").append(comment);
            i++;
        }
    }
    else {
        alert("error");
    }
    return res.data;
}

function getLocation(LabData) {
    //HTTPFetch();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            userLoc = { lat: position.coords.latitude, lng: position.coords.longitude, };
            console.log(position.coords.latitude + position.coords.longitude);

            //取得最近檢驗所
            fetchNearLab(userLoc["lng"], userLoc["lat"]);
            initMap(userLoc, LabData);
        },
            function (error) {
                if (error.code == error.PERMISSION_DENIED) {
                    alert("別拒絕我嘛~ 我能幫你找到你附近的檢驗所呦~");
                }
                var userLoc = { lat: 24.1369088, lng: 120.6550528 };
                initMap(userLoc, LabData);
            }, { enableHighAccuracy: true });
    } else {
        userLoc = { lat: 24.1369088, lng: 120.6550528 };
        initMap(userLoc, LabData);
    }
    console.log("INIT");
    window.initMap = initMap;
}

async function httpGetAsync(theUrl) {
    try {
        await axios.get(theUrl, {}).then((resp) => {
            console.log(resp["data"]);
            LabData = resp["data"]
        });
    } catch (error) {
        alert("ERROR" + error);
    }
}

