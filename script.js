const apiUrl = "https://www.ryanair.com/api/farfnd/3/oneWayFares?&departureAirportIataCode=KRK&language=pl&limit=";


async function getFlights(limit = 30, market = "pl-pl", priceValue = 350, departureDateFrom="2021-03-10", departureDateTo="2022-03-02") {
    const response = await fetch(`${apiUrl}${limit}&market=${market}&offset=0&outboundDepartureDateFrom=${departureDateFrom}&outboundDepartureDateTo=${departureDateTo}&priceValueTo=${priceValue}`);
    if (response.ok) {
        const flights = await response.json();
        return flights;
    } throw new Error(`Server send ${response.statusText}`);
}

getFlights()
    .then(response => { getFlightsByTime(response) })
    .catch(err => { console.error(err) });


function getFlightsByTime(response) {
    const flightsByTime = [];
    const regex = /T((1[0-9])|0[7-9]|(2[0-2]))/gi;
    
    response.fares.filter(element => {
        const ticketPrice = element.outbound.price.value;
        (ticketPrice < 350 && element.outbound.departureDate.match(regex)) ? flightsByTime.push(element) : element;
    }) 
    displayFlights(flightsByTime);
    
}

function displayFlights(elements) {
    for (let element of elements) {
        //   console.log(element);
        const body = document.querySelector("body");
        const text = document.createElement("p");
        text.innerText = `${element.outbound.arrivalAirport.countryName} - ${element.outbound.arrivalAirport.city.name} ${element.outbound.departureDate} ${element.outbound.arrivalDate} ${element.outbound.price.value} ${element.outbound.price.currencyCode}`;
        body.appendChild(text);
        
    }
}
getFlights();