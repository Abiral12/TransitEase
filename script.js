const menuToggle = document.getElementById('menu-toggle');
    const navbar = document.getElementById('navbar');
    const userActions = document.getElementById('user-actions');

    menuToggle.addEventListener('click', () => {
        navbar.classList.toggle('hidden');
        userActions.classList.toggle('hidden');
    });


    

    let map; // Global map instance

    // Default coordinates for Mid Valley International College
    const defaultCoordinates = [27.7082521, 85.3303915]; // Replace with the actual latitude and longitude
    
    // Initialize the map with the default location
    function initializeMap() {
      map = L.map('map').setView(defaultCoordinates, 15); // Center map on Mid Valley International College
    
      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);
    
      // Add a marker for the default location
      L.marker(defaultCoordinates)
        .addTo(map)
        .bindPopup('Mid Valley International College')
        .openPopup();
    }
    
    // Ensure the map initializes when the page loads
    window.addEventListener('load', initializeMap);
    
    // Add event listener for finding the route
    document.getElementById('find-route')?.addEventListener('click', function () {
      const start = document.getElementById('start').value;
      const end = document.getElementById('end').value;
    
      if (!start || !end) {
        alert('Please enter both start and end locations.');
        return;
      }
    
      // Clear any existing map instance
      if (map) {
        map.remove();
      }
    
      // Geocode start and end locations
      Promise.all([geocodeLocation(start), geocodeLocation(end)])
        .then(([startCoords, endCoords]) => {
          map = L.map('map').setView([startCoords[1], startCoords[0]], 13);
    
          // Fix map container size
          setTimeout(() => map.invalidateSize(), 300);
    
          // Add OpenStreetMap tiles
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors',
          }).addTo(map);
    
          // Add markers for start and end points
          L.marker([startCoords[1], startCoords[0]])
            .addTo(map)
            .bindPopup('Start: ' + start)
            .openPopup();
          L.marker([endCoords[1], endCoords[0]])
            .addTo(map)
            .bindPopup('End: ' + end)
            .openPopup();
    
          // Fetch the shortest route using OSRM
          const osrmURL = `https://router.project-osrm.org/route/v1/driving/${startCoords.join(
            ','
          )};${endCoords.join(',')}?overview=full&geometries=geojson`;
          fetch(osrmURL)
            .then((response) => response.json())
            .then((data) => {
              if (data.routes && data.routes.length > 0) {
                const route = data.routes[0];
                const coordinates = route.geometry.coordinates.map(([lon, lat]) => [
                  lat,
                  lon,
                ]);
    
                // Draw the route on the map
                const routeLine = L.polyline(coordinates, {
                  color: 'blue',
                  weight: 5,
                }).addTo(map);
                map.fitBounds(routeLine.getBounds());
    
                // Display route information
                document.getElementById('route-results').innerHTML = `
                  <p class="text-green-700 font-semibold">
                    Shortest Route Found: ${(route.distance / 1000).toFixed(2)} km 
                    <br> Duration: ${(route.duration / 60).toFixed(2)} minutes
                  </p>
                `;
              } else {
                alert('No route found between these locations.');
              }
            })
            .catch((err) => {
              console.error('Error fetching route:', err);
              alert('Failed to fetch the route. Please try again.');
            });
        })
        .catch((err) => {
          console.error('Error geocoding location:', err);
          alert('Location not found. Please check your inputs.');
        });
    });
    
    // Geocoding function using Nominatim API
    function geocodeLocation(location) {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        location
      )}`;
      return fetch(url)
        .then((response) => response.json())
        .then((data) => {
          if (data.length === 0) throw new Error('Location not found.');
          return [data[0].lon, data[0].lat];
        });
    }
    

// // Call the function to initialize the map on page load
// document.addEventListener('DOMContentLoaded', initializeMap);

    
//     // Initialize the map on page load
//     document.addEventListener('DOMContentLoaded', initializeMap);
    

//     document.getElementById('generate-ticket').addEventListener('click', function() {
//     const from = document.getElementById('from').value;
//     const to = document.getElementById('to').value;
//     const departingDate = document.getElementById('departing-date').value;
//     const time = document.getElementById('time').value;
//     const seats = document.getElementById('seats').value;
//     const passengerName = document.getElementById('passenger-name').value;

//     if (!from || !to || !departingDate || !time || !seats || !passengerName) {
//         alert("Please fill in all the fields.");
//         return;
//     }

//     // Generate Ticket Data
//     const ticketData = `Passenger: ${passengerName}\nFrom: ${from}\nTo: ${to}\nDate: ${departingDate}\nTime: ${time}\nSeats: ${seats}\nStatus: Confirmed(unpaid)`;
//     // alert("Ticket Generated:\n" + ticketData);

//     // Display QR Code
//     const qrcodeContainer = document.getElementById('qrcode-container');
//     qrcodeContainer.classList.remove('hidden');
//     document.getElementById('qrcode').innerHTML = ""; // Clear previous QR code

//     const qrcode = new QRCode(document.getElementById('qrcode'), {
//         text: ticketData,
//         width: 128,
//         height: 128
//     });
// });


document.addEventListener("DOMContentLoaded", () => {
  // Timeline for the intro animation
  const timeline = gsap.timeline();

  // Header animation: slide down
  timeline
    .from("#header", {
      y: -100,
      opacity: 0,
      duration: 0.5,
      ease: "power4.out",
      
    })
    // Banner text animation: fade and scale in
    .from(
      "#banner-text",
      {
        y: 50,
        opacity: 0,
        scale: 0.8,
        duration: 1,
        ease: "power1.out",
      },
      "-=0.5" // Overlap with the previous animation
    )
    .from(
      "#home p",
      {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power1.out",
      },
      "-=0.8"
    )
    // Search bar animation: slide up
    .from(
      "form",
      {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power1.out",
      },
      "-=0.8"
    );

  // Background image zoom-in effect
  gsap.from("#welcome-img", {
    scale: 1.3,
    duration: 2,
    opacity: 0,
    ease: "power1.out",
  });
});

// JavaScript to handle the scroll event
// window.addEventListener('scroll', function() {
//     const header = document.getElementById('header');
//     if (window.scrollY > 50) {  // Adjust this value to trigger the change earlier or later
//       header.classList.add('scrolled');  // Add the 'scrolled' class when scrolled down
//     } else {
//       header.classList.remove('scrolled');  // Remove the 'scrolled' class when back to top
//     }
//   });
  
//   // Initialize Swiper
//   var swiper = new Swiper(".mySwiper", {
//     loop: true,
//     autoplay: {
//       delay: 3000, // 3 seconds delay
//       disableOnInteraction: false,
//     },
//     pagination: {
//       el: ".swiper-pagination",
//       clickable: true,
//     },
//     navigation: {
//       nextEl: ".swiper-button-next",
//       prevEl: ".swiper-button-prev",
//     },
//   });

// // Day Selection Logic
// const days = document.querySelectorAll('.day');

// days.forEach(day => {
//     day.addEventListener('click', () => {
//         // Remove active class from all days
//         days.forEach(d => d.classList.remove('active'));
//         // Add active class to the clicked day
//         day.classList.add('active');
//     });
// });


// Select the header element
const header = document.getElementById("header");

// Add a scroll event listener
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});


