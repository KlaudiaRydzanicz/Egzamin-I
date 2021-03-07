const apiUrl = "https://www.ryanair.com/api/farfnd/3/";

async function getFlights(limit = 30, market = "pl-pl", priceValue = 350, departureDateFrom = "2021-03-10",
    departureDateTo = "2022-03-02", iataCode = "KRK", language = "pl", fares = "oneWayFares") {
    const queryParams = `${fares}?&departureAirportIataCode=${iataCode}` +
        `&language=${language}&limit=${limit}&market=${market}` +
        `&offset=0&outboundDepartureDateFrom=${departureDateFrom}` +
        `&outboundDepartureDateTo=${departureDateTo}&priceValueTo=${priceValue}`;
    
    const url = encodeURI(apiUrl + queryParams);
    const response = await fetch(url);
    if (response.ok) {
        return await response.json();
    }
    throw new Error(`Server send ${response.statusText}`);
}

(function () {
    getFlights()
        .then(response => { getFlightsByTime(response) })
        .catch(err => console.error(err));
})();

function getFlightsByTime(response) {
    const flightsByTime = [];
    const regex = /T((1[0-9])|0[7-9]|(2[0-2]))/gi; // let departure = new Date(element.outbound.departureDate) departure.getHours() > 7 || departure.getHours() < 22

    response.fares.filter(element => {
        if (element.outbound.departureDate.match(regex)) flightsByTime.push(element);
    })
    displayFlights(flightsByTime);
}

function displayFlights(elements) {
    for (let element of elements) {
        const body = document.querySelector("body");
        const text = document.createElement("p");
        text.innerText = `${element.outbound.arrivalAirport.countryName} - ${element.outbound.arrivalAirport.city.name} ${element.outbound.departureDate} ${element.outbound.arrivalDate} ${element.outbound.price.value} ${element.outbound.price.currencyCode}`;
        body.appendChild(text);
    }
}