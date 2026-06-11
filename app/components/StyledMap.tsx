/// <reference types="google.maps" />

"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    google: typeof google;
  }
}

const StyledMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      // Fallback to embedded map if no API key
      mapRef.current.innerHTML = `
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3634.5025!2d89.36!3d24.851!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fe0c0000000000%3A0x0!2sNaz%20Garden!5e0!3m2!1sen!2sbd!4v1654321098765"
          width="100%"
          height="100%"
          style="border: 0"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      `;
      return;
    }

    // Load Google Maps API
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker`;
      script.async = true;
      script.setAttribute("loading", "async");
      script.onerror = () => {
        console.error("Failed to load Google Maps API");
        // Fallback to embedded map
        if (mapRef.current) {
          mapRef.current.innerHTML = `
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3634.5025!2d89.36!3d24.851!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fe0c0000000000%3A0x0!2sNaz%20Garden!5e0!3m2!1sen!2sbd!4v1654321098765"
              width="100%"
              height="100%"
              style="border: 0"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          `;
        }
      };
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }

    function initMap() {
      if (!mapRef.current) return;

      // Naz Garden coordinates
      const venueLocation = { lat: 24.8505, lng: 89.3615 };

      // Custom map styling
      const mapStyle = [
        {
          featureType: "all",
          elementType: "geometry.fill",
          stylers: [{ color: "#1a0a10" }],
        },
        {
          featureType: "all",
          elementType: "geometry.stroke",
          stylers: [{ color: "#c9952a" }, { weight: 0.5 }],
        },
        {
          featureType: "all",
          elementType: "labels.text",
          stylers: [{ color: "#c9952a" }, { weight: "bold" }],
        },
        {
          featureType: "all",
          elementType: "labels.text.fill",
          stylers: [{ color: "#c9952a" }],
        },
        {
          featureType: "all",
          elementType: "labels.text.stroke",
          stylers: [{ color: "#0d0608" }, { weight: 2 }],
        },
        {
          featureType: "water",
          elementType: "geometry.fill",
          stylers: [{ color: "#0d0608" }],
        },
        {
          featureType: "road",
          elementType: "geometry.fill",
          stylers: [{ color: "#2a1200" }],
        },
        {
          featureType: "road",
          elementType: "geometry.stroke",
          stylers: [{ color: "#c9952a" }, { weight: 1 }],
        },
        {
          featureType: "poi",
          elementType: "geometry.fill",
          stylers: [{ color: "#3a2a1a" }],
        },
        {
          featureType: "poi",
          elementType: "labels.text.fill",
          stylers: [{ color: "#c9952a" }],
        },
      ];

      mapInstanceRef.current = new google.maps.Map(mapRef.current, {
        zoom: 17,
        center: venueLocation,
        styles: mapStyle,
        disableDefaultUI: true,
        gestureHandling: "auto",
        mapTypeControl: false,
      });

      // Custom marker
      const marker = new google.maps.Marker({
        position: venueLocation,
        map: mapInstanceRef.current,
        title: "Naz Garden, Bogura",
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: "#c9952a",
          fillOpacity: 1,
          strokeColor: "#faf6ee",
          strokeWeight: 2,
        },
      });

      // Add info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 12px; font-family: serif; text-align: center;">
            <h3 style="margin: 0 0 8px 0; color: #c9952a; font-size: 16px;">Naz Garden</h3>
            <p style="margin: 0; color: #c9952a; font-size: 12px;">Bogura, Bangladesh</p>
          </div>
        `,
      });

      marker.addListener("click", () => {
        infoWindow.open(mapInstanceRef.current, marker);
      });

      // Open info window by default
      infoWindow.open(mapInstanceRef.current, marker);
    }
  }, []);

  return (
    <div
      ref={mapRef}
      className='w-full h-full min-h-55 sm:min-h-80 lg:min-h-105 rounded-lg cursor-pointer touch-manipulation hover:opacity-90 transition-opacity'
      onClick={() => {
        window.open(
          "https://maps.app.goo.gl/bXseqyVyUQ8Y239j7?g_st=ic",
          "_blank",
        );
      }}
      style={{
        minHeight: "400px",
      }}
      title='Click to open in Google Maps'
    />
  );
};

export default StyledMap;
