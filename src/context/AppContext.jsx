import React, { createContext, useContext, useState } from 'react';

// Create the context
const AppContext = createContext();

// Custom hook to use the AppContext
export const useAppContext = () => {
  return useContext(AppContext);
};

// Context provider component
export const AppProvider = ({ children }) => {
  const [customerData, setCustomerData] = useState({ customer_id: 0,customer_name:'',customer_mail:'' });
  const [businessData, setBusinessData] = useState({ business_id: 0,business_name:'',business_type:'',business_mail:'' });

  const initateCustomerdata = (customer) => {
    setCustomerData((prevData) => ({
      ...prevData,
      customer_id: customer.customer_id,
      customer_name:customer.customer_name,
      customer_mail:customer.customer_email 
    }));
    setBusinessData({ business_id: 0,business_name:'',business_type:'',business_mail:'' });
  };

  const initateBusinessdata = (business) => {
    setBusinessData((prevData) => ({
      ...prevData,
      business_id: business.business_id,
      business_name:business.business_name,
      business_mail:business.business_mail,
      business_type: business.business_type
    }));
    setCustomerData({ customer_id: 0,customer_name:'',customer_mail:'' })
  };

  return (
    <AppContext.Provider value={{ customerData,businessData, initateCustomerdata, initateBusinessdata }}>
      {children}
    </AppContext.Provider>
  );
};