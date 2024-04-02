// AddressForm.js
import React, { useEffect, useRef, useState } from 'react';
import { TextField, Button } from '@aws-amplify/ui-react';

const AddressForm = () => {
  const streetAddress1Ref = useRef(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // Dynamically load the Google Places API script
  useEffect(() => {
    const scriptId = 'google-places-script';

    const loadScript = () => {
      if (document.getElementById(scriptId) || window.google) {
        setIsScriptLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&loading=async&libraries=places`;
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => setIsScriptLoaded(true);
    };

    loadScript();
  }, []);

  // Initialize Autocomplete once the script is loaded
  useEffect(() => {
    if (isScriptLoaded && streetAddress1Ref.current && window.google) {
      const autocomplete = new window.google.maps.places.Autocomplete(streetAddress1Ref.current, {
        types: ['address'],
        componentRestrictions: { country: 'us' },
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        // Implement fillInAddress function based on your requirements
        fillInAddress(place);
      });
    }
  }, [isScriptLoaded]);

  const fillInAddress = (place) => {
    // Here you can extract and set the address components
    console.log(place); // Log the place object to see available information
    // Example: setFormFields({ ...formFields, city: place.address_components... });
  };

  return (
    <form>
      <TextField label="Street Address 1" id="street-address-1" name="streetAddress1" ref={streetAddress1Ref} placeholder="Enter your street address" />
      <TextField label="Street Address 2" id="street-address-2" name="streetAddress2" placeholder="Apartment, suite, etc. (optional)" />
      <TextField label="City" id="city" name="city" />
      <TextField label="State" id="state" name="state" />
      <TextField label="Zip" id="zip" name="zip" />
      <Button type="submit">Submit</Button>
    </form>
  );
};

export default AddressForm;
