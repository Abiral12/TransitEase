const menuToggle = document.getElementById('menu-toggle');
    const navbar = document.getElementById('navbar');
    const userActions = document.getElementById('user-actions');

    menuToggle.addEventListener('click', () => {
        navbar.classList.toggle('hidden');
        userActions.classList.toggle('hidden');
    });


let map; // Global map instance
    
        document.getElementById('find-route').addEventListener('click', function() {
            const start = document.getElementById('start').value;
            const end = document.getElementById('end').value;
    
            if (!start || !end) {
                alert("Please enter both start and end locations.");
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
                        attribution: '© OpenStreetMap contributors'
                    }).addTo(map);
    
                    // Add markers for start and end points
                    const startMarker = L.marker([startCoords[1], startCoords[0]])
                        .addTo(map)
                        .bindPopup("Start: " + start)
                        .openPopup();
                    const endMarker = L.marker([endCoords[1], endCoords[0]])
                        .addTo(map)
                        .bindPopup("End: " + end)
                        .openPopup();
    
                    // Fetch the shortest route using OSRM
                    const osrmURL = `https://router.project-osrm.org/route/v1/driving/${startCoords.join(',')};${endCoords.join(',')}?overview=full&geometries=geojson`;
                    fetch(osrmURL)
                        .then(response => response.json())
                        .then(data => {
                            if (data.routes && data.routes.length > 0) {
                                const route = data.routes[0];
                                const coordinates = route.geometry.coordinates.map(([lon, lat]) => [lat, lon]);
    
                                // Draw the route on the map
                                const routeLine = L.polyline(coordinates, { color: 'blue', weight: 5 }).addTo(map);
                                map.fitBounds(routeLine.getBounds());
    
                                // Display route information
                                document.getElementById('route-results').innerHTML = `
                                    <p class="text-green-700 font-semibold">
                                        Shortest Route Found: ${(route.distance / 1000).toFixed(2)} km 
                                        <br> Duration: ${(route.duration / 60).toFixed(2)} minutes
                                    </p>
                                `;
                            } else {
                                alert("No route found between these locations.");
                            }
                        })
                        .catch(err => {
                            console.error("Error fetching route:", err);
                            alert("Failed to fetch the route. Please try again.");
                        });
                })
                .catch(err => {
                    console.error("Error geocoding location:", err);
                    alert("Location not found. Please check your inputs.");
                });
        });
    
        // Geocoding function using Nominatim API
        function geocodeLocation(location) {
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;
            return fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.length === 0) throw new Error("Location not found.");
                    return [data[0].lon, data[0].lat];
                });
        }

        document.getElementById('generate-ticket').addEventListener('click', function() {
    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
    const departingDate = document.getElementById('departing-date').value;
    const time = document.getElementById('time').value;
    const seats = document.getElementById('seats').value;
    const passengerName = document.getElementById('passenger-name').value;

    if (!from || !to || !departingDate || !time || !seats || !passengerName) {
        alert("Please fill in all the fields.");
        return;
    }

    // Generate Ticket Data
    const ticketData = `Passenger: ${passengerName}\nFrom: ${from}\nTo: ${to}\nDate: ${departingDate}\nTime: ${time}\nSeats: ${seats}\nStatus: Confirmed(unpaid)`;
    // alert("Ticket Generated:\n" + ticketData);

    // Display QR Code
    const qrcodeContainer = document.getElementById('qrcode-container');
    qrcodeContainer.classList.remove('hidden');
    document.getElementById('qrcode').innerHTML = ""; // Clear previous QR code

    const qrcode = new QRCode(document.getElementById('qrcode'), {
        text: ticketData,
        width: 128,
        height: 128
    });
});


document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);
  
    // Header Animation
    gsap.from("header", { duration: 1, delay: 1, y: -50, opacity: 0, ease: "power1.out" });

    // Welcome Text Animation
    gsap.from("#banner-text", {
      duration: 1.5,
      x: 100,
      opacity: 0,
      ease: "power1.out",
      delay: 1,
    });

    gsap.from("#banner-text + p", {
      duration: 1.5,
      x: -100,
      opacity: 0,
      ease: "power1.out",
      delay: 1.5,
    });

    gsap.from("#welcome-img", 
      { scale: 0, opacity: 0 , duration: 1,}, // Starting state
      { scale: 1, opacity: 1, duration: 1, ease: "sine.inOut" } // Animation properties
    );

  
    // // Section Slide-in Animation
    // gsap.from("#services", {
    //   transform: "translateX(-200%)",
    //   scrollTrigger: {
    //     trigger: "#services",
    //     scroller: "body",
    //     start: "top 20%",
    //     end: "top -100%",
    //     scrub: 2,
    //     pin: true,
    //     markers: true
    //   },
    //   // duration: 1,
    //   // y: 50,
    //   // opacity: 0,
    //   // stagger: 0.2,
    //   // ease: "power1.out",
    // });


  
    // Button Hover Animation
    gsap.utils.toArray("button").forEach((button) => {
      button.addEventListener("mouseenter", () => {
        gsap.to(button, { scale: 1.1, duration: 0.2 });
      });
      button.addEventListener("mouseleave", () => {
        gsap.to(button, { scale: 1, duration: 0.2 });
      });
    });
  

  
    // Map Zoom Animation
    gsap.from("#map", {
      scrollTrigger: {
        trigger: "#map",
        start: "top 80%",
      },
      scale: 0.8,
      opacity: 0,
      duration: 1,
      ease: "power2.out",
    });
  
    // Footer Animation
    gsap.from("footer", {
      scrollTrigger: {
        trigger: "footer",
        start: "top 90%",
      },
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power1.out",
    });
  });



// JavaScript to handle the scroll event
window.addEventListener('scroll', function() {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {  // Adjust this value to trigger the change earlier or later
      header.classList.add('scrolled');  // Add the 'scrolled' class when scrolled down
    } else {
      header.classList.remove('scrolled');  // Remove the 'scrolled' class when back to top
    }
  });
  
  