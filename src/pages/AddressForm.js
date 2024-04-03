// AddressForm.js
import React, { useEffect, useRef, useState } from 'react';
import { TextField, Button } from '@aws-amplify/ui-react';

function AddressForm() {
  //console.log('AddressForm component rendered');
  const streetAddress1Ref = useRef(null);
  const streetAddress2Ref = useRef(null);
  const cityRef = useRef(null);
  const stateRef = useRef(null);
  const zipRef = useRef(null);
  //const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  // Add state for error messages
  const [errors, setErrors] = useState({
    streetAddress1: '',
    city: '',
    state: '',
    zip: '',
  });

  // Validate form fields
  const validateFields = () => {
    let newErrors = {
      streetAddress1: '',
      city: '',
      state: '',
      zip: '',
    };

    // Validate street address
    if (!streetAddress1Ref.current.value.trim()) {
      newErrors.streetAddress1 = 'Street Address 1 is required';
    }

    // Validate city
    if (!cityRef.current.value.trim()) {
      newErrors.city = 'City is required';
    }

    // Validate state
    if (!stateRef.current.value.trim()) {
      newErrors.state = 'State is required';
    }

    // Validate zip
    if (!zipRef.current.value.trim()) {
      newErrors.zip = 'Zip is required';
    }

    setErrors(newErrors);

    // If any errors were found, return false
    return !Object.values(newErrors).some(error => error !== '');
  };

  // Call validateFields when form is submitted
  const handleSubmit = (event) => {
    event.preventDefault();

    if (validateFields()) {
      // If validation passed, proceed with form submission
    }
  };
  

  // Dynamically load the Google Places API script
  useEffect(() => {
    const fillInAddress = (place) => {
      const addressComponents = place.address_components;
      const streetNumber = get(addressComponents, 'street_number');
      const streetName = get(addressComponents, 'route');
      const city = get(addressComponents, 'locality');
      const state = get(addressComponents, 'administrative_area_level_1');
      const zip = get(addressComponents, 'postal_code');
    
      // Assuming you have refs for the other fields
      streetAddress1Ref.current.value = `${streetNumber} ${streetName}`;
      streetAddress2Ref.current.value = '';
      cityRef.current.value = city;
      stateRef.current.value = state;
      zipRef.current.value = zip;
    };
    const scriptId = 'google-places-script';
  
    const loadScript = () => {
      if (document.getElementById(scriptId) || window.google) {
        //setIsScriptLoaded(true);
        return;
      }
  
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      document.body.appendChild(script);
  
      script.onload = () => {
        //setIsScriptLoaded(true);
  
        // Set up Autocomplete here, after the API has loaded
        if (streetAddress1Ref.current) {
          const autocomplete = new window.google.maps.places.Autocomplete(streetAddress1Ref.current, {
            types: ['address'],
            componentRestrictions: { country: 'us' },
          });

          autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            // Implement fillInAddress function based on your requirements
            fillInAddress(place);
          });
          //console.log('Autocomplete has been set up.');
        }
      };
    };
  
    loadScript();
  }, []);
  
  // Helper function to get the value of an address component
  const get = (components, type) => {
    const component = components.find(component => component.types.includes(type));
    return component ? component.long_name : '';
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField label="Street Address 1" id="street-address-1" name="streetAddress1" ref={streetAddress1Ref} placeholder="Enter your street address" />
      {errors.streetAddress1 && <div>{errors.streetAddress1}</div>}
      <TextField label="Street Address 2" id="street-address-2" name="streetAddress2" ref={streetAddress2Ref}  placeholder="Apartment, suite, etc. (optional)" />
      <TextField label="City" id="city" name="city" ref={cityRef} placeholder='City'  />
      {errors.city && <div>{errors.city}</div>}
      <TextField label="State" id="state" name="state" ref={stateRef} placeholder='State' />
      {errors.state && <div>{errors.state}</div>}
      <TextField label="Zip" id="zip" name="zip" ref={zipRef} placeholder='Zip' />
      {errors.zip && <div>{errors.zip}</div>}
      <Button type="submit">Submit</Button>
    </form>
  );
};
export default AddressForm;