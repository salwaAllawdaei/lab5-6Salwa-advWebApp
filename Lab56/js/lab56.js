
const geoKey = "d5d2ee05032da2352d58fe53fda8106b";

mapboxgl.accessToken = "pk.eyJ1IjoiNjE4NzE0NCIsImEiOiJjbDJhZmxldmYwMHdoM2NwN2cxNGZkcjVnIn0.nk5Yfg6OGIE8gS3F_XA0QQ";
let map;

let hydrants = [];

let Lab56ServiceUrl = "https://localhost:7205/api/Lab56";

let Lab56El = document.getElementById("items");
document.getElementById("task-submit").addEventListener("click", async () => {
    let taskNameEl = document.getElementById("task-name");
    let taskStreetNoEl = document.getElementById("task-street-no");
    let taskAddressEl = document.getElementById("task-address");
    let taskPostcodeEl = document.getElementById("task-postcode");
    //let taskRegionEl = document.getElementById("task-region");
    let taskName = taskNameEl.value;
    let taskStreetNo = taskStreetNoEl.value;
    let taskAddress = taskAddressEl.value;
    let taskPostcode = taskPostcodeEl.value;
    let lati;
    let lngi;
    let getLoca = async function () {

        let loca = `http://api.positionstack.com/v1/forward?access_key=${geoKey}&query=${taskStreetNo}%20${taskAddress},%20Gatineau%20QC`;
        //console.log("fdsfsd");   
        let response = await axios.get(loca);

        let data = response.data;
        //let [first] = data;
        let first = data.data[0];
        lati = first.latitude + "";
        lngi = first.longitude + "";


    }
    await getLoca();
    // console.log(lati);
    // console.log(lngi);
    if (taskName.trim() != '') {
        let newTask = { name: taskName, address: taskAddress, postcode: taskPostcode, streetNo: taskStreetNo, lat: lati, lng: lngi };
        //console.log(JSON.stringify(newTask));
        let newLab56Data = await fetch(Lab56ServiceUrl,
            {
                cache: 'no-cache',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify(newTask)
            });
        getLab56s();
        taskNameEl.value = "";
    }
});

let getLab56s = async function () {
    //console.log("sadas");
    let Lab56Data = await (await fetch(Lab56ServiceUrl,
        {
            cache: 'no-cache',
            method: 'GET'
        })).json();
    //console.log(Lab56Data);
    let html = "";
    html += "<ol>";
    let conList;
    for (let i = 0; i < Lab56Data.length; i++) {
        html += `<li>${Lab56Data[i].name}  ${Lab56Data[i].streetNo} ${Lab56Data[i].address} </li>`;
        //console.log(Lab56Data[i].address);
        conList += Lab56Data[i].address;

        lng = Lab56Data[i].lng;
        lat = Lab56Data[i].lat;
        //console.log({ "lat": lat, "lng": lng });
        hydrants.push(new mapboxgl.Marker().setLngLat([lng, lat]).setPopup(new mapboxgl.Popup().
            setHTML(`${Lab56Data[i].name}<br>${Lab56Data[i].phoneNumber} `).addTo(map)));
    }
    html += "</ol>";
    //console.log("sadas");
    Lab56El.innerHTML = html;

}

let mapInit = function () {
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/6187144/cl2afv12m000c14p5qtma8qwz',
        center: [-75.765, 45.456],
        zoom: 13.5
    });
}

mapInit();
getLab56s();