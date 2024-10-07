import React, { useState, useEffect } from "react";
import './AppointmentForm.css'; // Import the CSS file
import axios from 'axios'; // Import axios for HTTP requests
import { useNavigate, useLocation } from 'react-router-dom';


const appointments = [];

// Check availability and book an appointment
const bookAppointment = (serviceCategory, date, time) => {
  const existingAppointment = appointments.find(appointment => 
    appointment.serviceCategory === serviceCategory &&
    appointment.date === date &&
    appointment.time === time
  );

  return existingAppointment ? { 
    success: false, 
    message: `Cannot book appointment. ${serviceCategory} is already booked at ${time} on ${date}.` 
  } : { success: true };
};

const AppointmentForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state?.editData || {}; // Get the data passed for editing, if any

  // State variables to manage form data and validation errors
  const [formData, setFormData] = useState({
    name: editData.name || "",
    contactNumber: editData.contactNumber || "",
    email: editData.email || "",
    date: editData.date || "",
    time: editData.time || "",
    services: editData.services || [],
    requests: editData.requests || "",
   
  });
  const [errors, setErrors] = useState({});
  const [serviceOptions, setServiceOptions] = useState({});
  const [servicePrices, setServicePrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [totalCost, setTotalCost] = useState(0);
  
  


  useEffect(() => {
    // Fetch services data when the component mounts
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const options = {};
        const prices = {};
        data.forEach(service => {
          if (!options[service.category]) {
            options[service.category] = [];
          }
          options[service.category].push(service.name);
          prices[service.name] = service.price;
        });
        setServiceOptions(options);
        setServicePrices(prices);
        
        const initialTotalCost = editData.services.reduce((sum, service) => sum + (prices[service] || 0), 0);
        setTotalCost(initialTotalCost);
      } catch (err) {
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    const newTotalCost = formData.services.reduce((sum, service) => sum + (servicePrices[service] || 0), 0);
    setTotalCost(newTotalCost);
  }, [formData.services, servicePrices]); // Recalculate total cost when services or prices change

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    if (type === "checkbox") {
      setFormData(prevFormData => ({
        ...prevFormData,
        services: checked
          ? [...prevFormData.services, value]
          : prevFormData.services.filter(service => service !== value),
      }));
    } else {
      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: value,
      }));
  
      // Trigger validation for the specific field if it's a text input
      validateField(name, value);
    }
  };
  const handleServiceChange = (service) => {
    const serviceCategory = Object.keys(serviceOptions).find(category =>
      serviceOptions[category].includes(service)
    );
  
    // Check if there's already a service from a different category selected
    const selectedCategories = new Set(formData.services.map(s => {
      return Object.keys(serviceOptions).find(category => serviceOptions[category].includes(s));
    }));
  
    // If selecting a service from a different category, alert the user
    if (selectedCategories.size > 0 && !selectedCategories.has(serviceCategory)) {
      alert("You can only select multiple services from the same category.");
      return;
    }
  
    const updatedServices = formData.services.includes(service)
      ? formData.services.filter(s => s !== service)
      : [...formData.services, service];
  
    setFormData(prevFormData => ({
      ...prevFormData,
      services: updatedServices,
    }));
  
    // Calculate the new total cost after the service change
    const newTotalCost = updatedServices.reduce((sum, service) => sum + (servicePrices[service] || 0), 0);
    setTotalCost(newTotalCost);
  };
  

  // Validate specific field
  const validateField = (name, value) => {
    const newErrors = { ...errors };
    const namePattern = /^[A-Za-z\s]+$/; // Letters and spaces only
    const contactNumberPattern = /^\d{10}$/; // Exactly 10 digits

    switch (name) {
      case "name":
        newErrors.name = !value || !namePattern.test(value) || value.length < 6
          ? "Full Name must only contain letters and spaces, and be at least 6 characters long."
          : "";
        break;
      case "contactNumber":
        newErrors.contactNumber = !value || !contactNumberPattern.test(value)
          ? "Contact Number must be exactly 10 digits & Only contain Numbers."
          : "";
        break;
      case "email":
        newErrors.email = !value || !value.includes('@') || value.length < 11
          ? "Email Address must include '@' and be at least 11 characters long."
          : "";
        break;
      case "date":
        const today = new Date();
        const selectedDate = new Date(value);
        const twoMonthsLater = new Date(today.setMonth(today.getMonth() + 2));
        newErrors.date = !value || selectedDate < new Date() || selectedDate > twoMonthsLater
          ? "Date must be within the next 2 months and not a past date."
          : "";
        break;
      case "time":
        newErrors.time = !value ? "You must select a time." : "";
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  // Validate all fields before submission
  const validateForm = () => {
    const newErrors = {};
    const namePattern = /^[A-Za-z\s]+$/; // Letters and spaces only
    const contactNumberPattern = /^\d{10}$/; // Exactly 10 digits

    // Name validation
    if (!formData.name || !namePattern.test(formData.name) || formData.name.length < 6) {
      newErrors.name = "Full Name must only contain letters and spaces, and be at least 6 characters long.";
    }

    // Contact number validation
    if (!formData.contactNumber || !contactNumberPattern.test(formData.contactNumber)) {
      newErrors.contactNumber = "Contact Number must be exactly 10 digits.";
    }

    // Email validation
    if (!formData.email || !formData.email.includes('@') || formData.email.length < 11) {
      newErrors.email = "Email Address must include '@' and be at least 11 characters long.";
    }

    // Date validation
    const today = new Date();
    const selectedDate = new Date(formData.date);
    const twoMonthsLater = new Date(today.setMonth(today.getMonth() + 2));
    if (!formData.date || selectedDate < new Date() || selectedDate > twoMonthsLater) {
      newErrors.date = "Date must be within the next 2 months and not a past date.";
    }

    // Time validation
    if (!formData.time) {
      newErrors.time = "You must select a time.";
    }

    // Services validation
    if (formData.services.length === 0) {
      newErrors.services = "You must select at least one service.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (validateForm()) {
      try {const appointmentConflict = bookAppointment(formData.services.join(', '), formData.date, formData.time);
        if (!appointmentConflict.success) {
          alert(appointmentConflict.message);
          return; // Stop form submission if there's a conflict
        }

        // If no conflicts, proceed with form submission
        const appointmentData = {
          ...formData,
          totalCost: totalCost, // Ensure totalCost is included
        };
  
        if (editData._id) {
          // Editing an existing appointment
          await axios.put(`/api/appointment/${editData._id}`, formData);
          alert("Your appointment has been updated.");
        } else {
          // Creating a new appointment
          const ressss = await axios.post('/api/appointment', appointmentData);
          console.log("resssssssss",ressss.data._id);
          
          await axios.post('/api/cart/appointment',ressss.data);
          alert("Thank you! Your appointment has been booked.");
        }
  
        // Reset form data after submission
        setFormData({
          name: "",
          contactNumber: "",
          email: "",
          date: "",
          time: "",
          services: [],
          requests: "",
        });
        setErrors({});
        setTotalCost(0);
        navigate('/MyAppointmentForm');
      } catch (error) {
        console.error("Error submitting the form:", error);
        alert("There was an error submitting your appointment. Please try again later.");
      }
    }
  };
  

  // Calculate the total cost of selected services in LKR
  const totalCostLKR = formData.services.reduce((sum, service) => sum + (servicePrices[service] || 0), 0);

  return (
    <div className="appointment-form-background">
      <div className="container">
      <h2 style={{ 
  fontSize: '2.5rem', // Adjust font size as needed
  color: '#E76F51', 
  fontFamily: 'Arial, sans-serif', // Change this to your preferred font
  lineHeight: '1.5' // Adjust line height for spacing
}}>
  Book Your Appointment
</h2>

        <form onSubmit={handleSubmit}>
          {/* Personal Information */}
          <div>
            <label>Full Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={() => validateField('name', formData.name)}
              required
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>
          <div>
            <label>Contact Number:</label>
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              onBlur={() => validateField('contactNumber', formData.contactNumber)}
              required
            />
            {errors.contactNumber && <p className="error">{errors.contactNumber}</p>}
          </div>
          <div>
            <label>Email Address:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={() => validateField('email', formData.email)}
              required
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

        
{/* Date and Time Selection */}
<div>
  <label>Date:</label>
  <input
    type="date"
    name="date"
    value={formData.date}
    onChange={handleChange}
    onBlur={() => validateField('date', formData.date)}
    required
    style={{
      width: '100%', // Full width
      padding: '12px', 
      fontSize: '1rem', 
      border: '2px solid #ccc', // Thicker border
      borderRadius: '8px',
      marginBottom: '20px',
      boxSizing: 'border-box', // Include padding and border in width
      backgroundColor: '#fff',
      color: '#333',
      fontFamily: "'Roboto', sans-serif", // Consistent font for input fields
      transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    }}
  />
  {errors.date && <p className="error">{errors.date}</p>}
</div>
<div>
  <label>Time:</label>
  <select
    name="time"
    value={formData.time}
    onChange={handleChange}
    onBlur={() => validateField('time', formData.time)}
    required
    style={{
      width: '100%', // Full width
      padding: '12px', 
      fontSize: '1rem', 
      border: '2px solid #ccc', // Thicker border
      borderRadius: '8px',
      marginBottom: '20px',
      boxSizing: 'border-box', // Include padding and border in width
      backgroundColor: '#fff',
      color: '#333',
      fontFamily: "'Roboto', sans-serif", // Consistent font for input fields
      transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    }}
  >
    <option value="">Select Time</option>
    <option value="09:00 AM">09:00 AM</option>
    <option value="10:00 AM">10:00 AM</option>
    <option value="11:00 AM">11:00 AM</option>
    <option value="01:00 PM">01:00 PM</option>
    <option value="02:00 PM">02:00 PM</option>
    <option value="03:00 PM">03:00 PM</option>
  </select>
  {errors.time && <p className="error">{errors.time}</p>}
</div>


<br></br>
          {/* Service Selection */}      
<div>
  <label htmlFor="services"><b>Select Services</b>(You can only select multiple services from the same category) :</label>

  <div id="services" className="services">
    {loading ? (
      <p>Loading...</p>
    ) : (
      Object.keys(serviceOptions).map(category => (
        <div key={category}>
          <h3><b>{category}</b></h3>
          {serviceOptions[category].map(service => (
            <div key={service} className="service-item">
              <input
                type="checkbox"
                id={service}
                value={service}
                checked={formData.services.includes(service)}
                onChange={() => handleServiceChange(service)}
              />
              <label htmlFor={service}>{service} - {servicePrices[service]?.toFixed(0)}  LKR</label>
            </div>
          ))}
        </div>
      ))
    )}
  </div>
  {errors.services && <p className="error">{errors.services}</p>}
</div>

{/* Special Requests */}
<div className="special-requests">
  <label>Special Requests:</label>
  <textarea
    name="requests"
    value={formData.requests}
    onChange={handleChange}
  />
</div>

<br></br>
          {/* Submit Button */}
          <div>
          <h3 style={{ 
  color: '#5C646C', // Font color
  fontSize: '1.5rem', // Adjust font size as needed
  fontWeight: 'bold', // Increase font weight
  fontFamily: 'Georgia, serif', // Change this to your preferred font
  lineHeight: '1.5' // Adjust line height for better spacing
}}>
  Total Cost: <span style={{ 
    fontFamily: 'Arial, sans-serif', // Change to a different font for numbers
    fontSize: '1.5rem', // Ensure font size matches or adjusts as needed
    fontWeight: 'bold' // You can keep the same or adjust it
  }}>
    LKR {totalCostLKR.toFixed(2)}
  </span>
</h3>
<br></br>
            <button type="submit">Book Appointment</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm