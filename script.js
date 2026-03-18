/**
 * ResQRoute Website - Interaction Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Sticky Navbar Effect ---
    const nav = document.querySelector('.glass-nav');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // --- Intersection Observer for Scroll Animations ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const scrollElements = document.querySelectorAll('.scroll-trigger');
    scrollElements.forEach(el => observer.observe(el));

    // Instant trigger for hero elements on load
    setTimeout(() => {
        const heroElements = document.querySelectorAll('.hero .fade-in-up, .hero .fade-in-right');
        heroElements.forEach(el => el.classList.add('visible'));
    }, 100);

    // --- Hero Map (Real India Map - Mumbai Overview) ---
    const heroMapEl = document.getElementById('heroMap');
    if (heroMapEl) {
        const heroMap = L.map('heroMap', {
            zoomControl: false,
            attributionControl: false,
            dragging: false,
            scrollWheelZoom: false,
            doubleClickZoom: false,
            touchZoom: false
        }).setView([19.0760, 72.8777], 12); // Mumbai center

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19
        }).addTo(heroMap);

        // Emergency unit dots across Mumbai
        const units = [
            { pos: [19.0596, 72.8295], icon: '🚓', label: 'PCR-42 Bandra' },
            { pos: [19.0178, 72.8478], icon: '🚑', label: 'MEDIC-7 Dadar' },
            { pos: [19.1190, 72.8680], icon: '🚒', label: 'FIRE-3 Andheri' },
            { pos: [19.0330, 72.8415], icon: '🚓', label: 'PCR-18 Prabhadevi' },
            { pos: [18.9548, 72.8324], icon: '🚑', label: 'MEDIC-12 Colaba' },
            { pos: [19.0760, 72.8777], icon: '🚒', label: 'FIRE-1 Kurla' },
            { pos: [19.1070, 72.8370], icon: '🚓', label: 'PCR-55 Goregaon' },
            { pos: [19.0452, 72.8208], icon: '🚑', label: 'MEDIC-21 Worli' },
        ];

        units.forEach(u => {
            const icon = L.divIcon({
                className: 'custom-vehicle-marker',
                html: `<div style="font-size:1.5rem;animation:pulse 2s infinite;">${u.icon}</div>`,
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });
            L.marker(u.pos, { icon }).addTo(heroMap).bindPopup(`<b>${u.label}</b>`);
        });

        // Slow auto-pan for visual effect
        let panAngle = 0;
        setInterval(() => {
            panAngle += 0.003;
            const lat = 19.0760 + Math.sin(panAngle) * 0.008;
            const lng = 72.8777 + Math.cos(panAngle) * 0.008;
            heroMap.panTo([lat, lng], { animate: true, duration: 2 });
        }, 3000);
    }

    // --- Animated Stat Counters ---
    const statNumbers = document.querySelectorAll('.stat-number');
    const animateCounter = (el) => {
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.innerText = Math.floor(current).toLocaleString('en-IN');
        }, 16);
    };
    
    // Start counters when hero becomes visible
    setTimeout(() => {
        statNumbers.forEach(el => animateCounter(el));
    }, 800);

    // --- Login Modal & Dashboard Logic ---
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const closeLoginBtn = document.getElementById('closeLoginBtn');
    const loginForm = document.getElementById('loginForm');
    
    const landingView = document.getElementById('landingView');
    const responderView = document.getElementById('responderView');
    const dashVehicleBadge = document.getElementById('dashVehicleBadge');
    const userVehicleIcon = document.getElementById('userVehicleIcon');
    const logoutBtn = document.getElementById('logoutBtn');

    // Open Modal
    loginBtn.addEventListener('click', () => {
        loginModal.classList.add('active');
    });

    // Close Modal
    closeLoginBtn.addEventListener('click', () => {
        loginModal.classList.remove('active');
    });

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.classList.remove('active');
        }
    });

    // Handle Login Submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get Form Values
        const unitId = document.getElementById('unitId').value.toUpperCase();
        const vehicleType = document.querySelector('input[name="vehicleType"]:checked').value;
        
        // Setup Dashboard based on vehicle
        let badgeColorClass = '';
        let iconStr = '';
        let typeStr = '';

        if (vehicleType === 'police') {
            badgeColorClass = 'accent-blue';
            iconStr = '🚓';
            typeStr = 'POLICE UNIT';
            document.documentElement.style.setProperty('--accent-blue', '#0a84ff'); // ensure styling
        } else if (vehicleType === 'fire') {
            badgeColorClass = 'code-red';
            iconStr = '🚒';
            typeStr = 'FIRE APPARATUS';
            // Tint route for fire
            document.documentElement.style.setProperty('--accent-blue', '#ff3b30'); 
            document.documentElement.style.setProperty('--accent-blue-glow', 'rgba(255, 59, 48, 0.4)');
        } else if (vehicleType === 'ambulance') {
            badgeColorClass = 'code-green';
            iconStr = '🚑';
            typeStr = 'MEDIC UNIT';
             // Tint route for ambulance
            document.documentElement.style.setProperty('--accent-blue', '#30d158'); 
            document.documentElement.style.setProperty('--accent-blue-glow', 'rgba(48, 209, 88, 0.4)');
        }

        // Update Dashboard Elements
        dashVehicleBadge.className = `badge ${badgeColorClass} dash-badge`;
        dashVehicleBadge.innerHTML = `${iconStr} ${typeStr} ${unitId}`;
        
        // Ensure map animation starts
        window.scrollTo(0, 0);

        // Transition Views
        loginModal.classList.remove('active');
        landingView.classList.add('hidden');
        responderView.classList.remove('hidden');
        
        // Initialize Real Map with the selected icon
        initMap(iconStr);
    });

    // Handle Logout
    logoutBtn.addEventListener('click', () => {
        // Reset properties
        document.documentElement.style.setProperty('--accent-blue', '#0a84ff'); 
        document.documentElement.style.setProperty('--accent-blue-glow', 'rgba(10, 132, 255, 0.4)');
        
        // Transition Views
        responderView.classList.add('hidden');
        landingView.classList.remove('hidden');
        loginForm.reset();
    });

    // Handle Status Toggles on Dashboard
    const statusBtns = document.querySelectorAll('.status-btn');
    statusBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            statusBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // --- Pre-Emption Override Button ---
    const overrideBtn = document.getElementById('overrideBtn');
    if (overrideBtn) {
        overrideBtn.addEventListener('click', () => {
            overrideBtn.classList.toggle('active');
            if (overrideBtn.classList.contains('active')) {
                overrideBtn.innerHTML = '<span class="icon">🟢</span> OVERRIDE ACTIVE';
                overrideBtn.style.background = 'var(--accent-green)';
                overrideBtn.style.color = '#000';
            } else {
                overrideBtn.innerHTML = '<span class="icon">🚥</span> PRE-EMPTION';
                overrideBtn.style.background = '';
                overrideBtn.style.color = '';
            }
        });
    }

    // --- Leaflet Map Integration ---
    let map;
    let vehicleMarker;
    let routePolyline;
    let simulationPos = 0;
    let simInterval;
    let incidentMarker;
    let destMarker;

    // =============================================
    // MUMBAI ROUTE: Bandra to Andheri via Western Express Highway
    // Detailed waypoints for smooth, realistic movement
    // =============================================
    const routeCoords = [
        [19.0596, 72.8295],  // Start: Bandra Station
        [19.0610, 72.8335],
        [19.0625, 72.8360],
        [19.0648, 72.8381],  // Bandra Reclamation
        [19.0672, 72.8393],
        [19.0700, 72.8400],  // Bandra-Worli Sea Link approach
        [19.0725, 72.8412],
        [19.0752, 72.8420],
        [19.0780, 72.8430],  // Linking Road junction
        [19.0810, 72.8440],
        [19.0838, 72.8458],
        [19.0860, 72.8475],  // Khar Station area
        [19.0885, 72.8490],
        [19.0910, 72.8510],
        [19.0940, 72.8528],  // Santacruz
        [19.0965, 72.8540],
        [19.0990, 72.8555],
        [19.1015, 72.8568],  // Vile Parle
        [19.1040, 72.8580],
        [19.1065, 72.8595],
        [19.1090, 72.8612],  // Andheri approach
        [19.1115, 72.8628],
        [19.1140, 72.8645],
        [19.1165, 72.8660],
        [19.1190, 72.8680],  // Destination: Andheri Station
    ];

    // Incident location (near Santacruz flyover)
    const incidentCoord = [19.0940, 72.8528];
    // Destination
    const destCoord = routeCoords[routeCoords.length - 1];

    function initMap(iconHtml) {
        // Destroy existing map if login again
        if (map) { map.remove(); map = null; }

        map = L.map('realMapContainer', {
            zoomControl: true,
            attributionControl: false
        }).setView(routeCoords[0], 14);

        // Add OpenStreetMap tiles (standard colorful tiles for real look)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19
        }).addTo(map);

        // Draw Route Polyline (thick, colored, with glow effect via shadow polyline)
        // Shadow (glow)
        L.polyline(routeCoords, {
            color: '#000',
            weight: 12,
            opacity: 0.3,
            lineJoin: 'round'
        }).addTo(map);
        // Main route
        routePolyline = L.polyline(routeCoords, {
            color: '#0a84ff',
            weight: 6,
            opacity: 0.9,
            lineJoin: 'round',
            dashArray: null
        }).addTo(map);

        // Incident Marker (red pulsing icon)
        const incidentIcon = L.divIcon({
            className: 'custom-vehicle-marker',
            html: '<div style="font-size:1.8rem;animation:pulse 1.5s infinite;">⚠️</div>',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
        incidentMarker = L.marker(incidentCoord, {icon: incidentIcon}).addTo(map);
        incidentMarker.bindPopup('<b style="color:#ff3b30;">🚨 Multi-Vehicle Collision</b><br>Western Express Hwy, near Santacruz Flyover<br><i>3 lanes blocked</i>');

        // Destination Marker
        const destIcon = L.divIcon({
            className: 'custom-vehicle-marker',
            html: '<div style="font-size:1.6rem;">📍</div>',
            iconSize: [30, 30],
            iconAnchor: [15, 30]
        });
        destMarker = L.marker(destCoord, {icon: destIcon}).addTo(map);
        destMarker.bindPopup('<b>🏥 Destination: Cooper Hospital, Andheri</b>');

        // Vehicle Marker
        const customIcon = L.divIcon({
            className: 'custom-vehicle-marker',
            html: `<div style="font-size:2.2rem;">${iconHtml}</div>`,
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });
        vehicleMarker = L.marker(routeCoords[0], {icon: customIcon, zIndexOffset: 1000}).addTo(map);

        // Fit map to the entire route
        map.fitBounds(routePolyline.getBounds().pad(0.1));

        // Start simulation
        simulationPos = 0;
        clearInterval(simInterval);
        simulateMovement();

        setTimeout(() => {
            map.invalidateSize();
        }, 500);
    }

    function simulateMovement() {
        simInterval = setInterval(() => {
            if (simulationPos < routeCoords.length - 1) {
                simulationPos += 0.04; // Slower for more waypoints = smoother
                const index = Math.floor(simulationPos);

                if (index < routeCoords.length - 1) {
                    const progress = simulationPos - index;
                    const lat = routeCoords[index][0] + (routeCoords[index + 1][0] - routeCoords[index][0]) * progress;
                    const lng = routeCoords[index][1] + (routeCoords[index + 1][1] - routeCoords[index][1]) * progress;

                    vehicleMarker.setLatLng([lat, lng]);

                    // Smoothly pan map to follow vehicle
                    map.panTo([lat, lng], { animate: true, duration: 0.5 });

                    // Update distance to turn (meters in India)
                    const remainingDist = Math.max(0, 500 - Math.floor(simulationPos * 20));
                    const distEl = document.getElementById('distanceToTurn');
                    if (distEl) distEl.innerText = remainingDist;

                    // Update speed randomly for realism
                    const speedEl = document.getElementById('metricSpeed');
                    if (speedEl) {
                        const speed = 45 + Math.floor(Math.random() * 35);
                        speedEl.innerText = speed;
                    }
                }
            } else {
                clearInterval(simInterval);
            }
        }, 400);
    }

    // Map Controls
    document.getElementById('recenterBtn')?.addEventListener('click', () => {
        if (map && vehicleMarker) {
            map.setView(vehicleMarker.getLatLng(), 16, { animate: true });
        }
    });

    document.getElementById('trafficLayerBtn')?.addEventListener('click', function () {
        if (this.innerText.includes('ON')) {
            this.innerText = '🚦 Traffic: OFF';
            this.style.color = 'var(--text-secondary)';
            this.style.borderColor = 'var(--border-glass)';
        } else {
            this.innerText = '🚦 Traffic: ON';
            this.style.color = 'var(--accent-red)';
            this.style.borderColor = 'var(--accent-red)';
        }
    });

});
