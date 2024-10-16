import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const BalanceSheet = () => {
  
  const location = useLocation();
  const {
    sellerNo: initialShopID,
    month: initialMonth,
    year: initialYear,
    reportId: initialReportId,
  } = location.state || {};

   
   const sellerNo = initialShopID === 1101 ? "Clothing" : 
   initialShopID === 1010 ? "Shoes" :
   initialShopID === 1011 ? "Accessories" :
   initialShopID === 5000 ? "Saloon" :
   "Unknown Shop"; 

  
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  
  const getMonthName = (monthNumber) => {
    return monthNames[parseInt(monthNumber, 10) - 1] || "";
  };

  const [sellerno, setShopID] = useState(initialShopID || "");
  const [month, setMonth] = useState(initialMonth || "");
  const [year, setYear] = useState(initialYear || "");
  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState({
    purchasingCost: "",
    storeMaintenance: "",
    electricityBill: "",
    internetBill: "",
    waterBill: "",
    employeeSalaries: "",
    marketingCost: "",
  });
  const [pettyCash, setPettyCash] = useState({
    minorRepairs: "",
    transportationCost: "",
    bankFees: "",
    courierFees: "",
    officeSupplies: "",
  });
  const [totalIncome, setTotalIncome] = useState("");
  const [totalExpenses, setTotalExpenses] = useState("");
  const [totalPettyCash, setTotalPettyCash] = useState("");
  const [netProfit, setNetProfit] = useState("");
  const [reportId, setReportId] = useState(initialReportId || null);
  const [errors, setErrors] = useState({});

  const formatDate = (month, year) => {
    const date = new Date(`${year}-${month}-01`);
    return date.toISOString().slice(0, 10); 
  };

  // Function to calculate totals
  const calculateTotals = () => {
    const totalExpensesAmount = Object.values(expenses).reduce(
      (acc, val) => acc + parseFloat(val || 0),
      0
    );
    const totalPettyCashAmount = Object.values(pettyCash).reduce(
      (acc, val) => acc + parseFloat(val || 0),
      0
    );

    

    setTotalIncome(parseFloat(income || 0)); 
    setTotalExpenses(totalExpensesAmount);
    setTotalPettyCash(totalPettyCashAmount);

    const netProfitAmount =
      parseFloat(income || 0) - totalExpensesAmount - totalPettyCashAmount;
    setNetProfit(netProfitAmount);
  };

 
  useEffect(() => {
    calculateTotals();
  }, [income, expenses, pettyCash]);

  // trigger income calculation
  const calculateIncome = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/income/calculate-income",
        {
          sellerNo: sellerno,
          year,
          month,
        }
      );
      console.log(response.data.message);
    } catch (error) {
      console.error("Error calculating income:", error);
    }
  };

  //fetch the total income
  const fetchTotalIncome = async () => {
    try {
      const formattedDate = formatDate(month, year); 
      const response = await axios.get(
        "http://localhost:5000/api/income/income",
        {
          params: { sellerNo: sellerno, year, month }, 
        }
      );
      setIncome(response.data.totalIncome || "");
    } catch (error) {
      console.error("Error fetching total income:", error);
    }
  };

  
  useEffect(() => {
    if (sellerno && month && year) {
      const fetchAndCalculateIncome = async () => {
        await calculateIncome(); 
        await fetchTotalIncome(); 
      };

      fetchAndCalculateIncome();
    }
  }, [sellerno, month, year]);

  const handleIncomeChange = (e) => setIncome(e.target.value);


  const handleInputChange = (e, setState) => {
    const { name, value } = e.target;
    const parsedValue = parseFloat(value);
  
    // Check if the field is empty
    if (value === "") {
      setState((prevState) => ({
        ...prevState,
        [name]: value,
        [`${name}Error`]: "This field is required", 
      }));
    } else {
      if (parsedValue >= 1 && Number.isFinite(parsedValue)) {
        // Clear error if valid value is entered
        setState((prevState) => ({
          ...prevState,
          [name]: value,
          [`${name}Error`]: "", 
        }));
      }
    }
  };
  
  
  

const handleExpenseChange = (e) => {
  const reqExFields = ["electricityBill",
                       "internetBill",
                       "waterBill",
                       "employeeSalaries",
                       "purchasingCost",
                       ]; 

  const isReqEx = reqExFields.includes(e.target.name); 

  if (isReqEx) {
   
    handleInputChange(e, setExpenses);
  } else {

    const { name, value } = e.target;
    setExpenses((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }
};



const handlePettyCashChange = (e) => {
    const reqPetFields = [
        "transportationCost",
        "bankFees",
        "courierFees",]; 

    const isReqPet = reqPetFields.includes(e.target.name); 

    if (isReqPet) {
    
    handleInputChange(e, setPettyCash);
    } else {
   
    const { name, value } = e.target;
    setPettyCash((prevState) => ({
    ...prevState,
    [name]: value,
    }));
    }
};

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (reportId) {
        
        await axios.put(`http://localhost:5000/api/reports/${reportId}`, {
          sellerNo: sellerno,
          month,
          year,
          totalIncome,
          totalExpenses,
          totalPettyCash,
          netProfit,
          expenses,
          pettyCash,
        });
        alert("Report updated successfully");
      } else {
        
        await axios.post("http://localhost:5000/api/reports", {
          sellerNo: sellerno,
          month,
          year,
          totalIncome,
          totalExpenses,
          totalPettyCash,
          netProfit,
          expenses,
          pettyCash,
        });
        alert("Report submitted successfully");
      }
    } catch (error) {
      console.error("Error handling submit:", error);
      alert("Please fill the all required fields");
    }
  };

  const handleDelete = async () => {
    if (!reportId) return;
    try {
      await axios.delete(`http://localhost:5000/api/reports/${reportId}`);
      alert("Report deleted successfully");
      setReportId(null); 
    } catch (error) {
      console.error("Error handling delete:", error);
      alert("Failed to delete report");
    }
  };

  const requiredFields = ["electricityBill","internetBill","waterBill","employeeSalaries","purchasingCost"];
  const requiredCashFields = ["transportationCost", "bankFees","courierFees",];


  return (
    <div className="flex flex-col items-center p-8 bg-[#F4F4F4] min-h-screen font-saira">
      <h1 className="text-4xl font-russo mb-6 text-[#5C646C]">
        Financial Management
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-[#F4F4F4] p-6 rounded-lg shadow-lg w-full max-w-6xl border-[5px] border-[#2E3192]"
      >
        <h2 className="text-center text-white text-lg font-semibold mb-4 bg-[#E76F51] py-2 rounded-t-md font-russo">
          Finance Report for the Month of {getMonthName(month)} {year}
        </h2>

        <div className="grid grid-cols-1 gap-6">
          {/* Shop ID, Month, and Year Section */}
          <div className="bg-[#D9D9D9] p-4 rounded-md shadow-inner border-2 border-[#C0C0C0]">
            <h3 className="text-lg font-semibold mb-2 text-[#5C646C] border-b-2 border-[#C0C0C0] font-russo text-left">
              Report Details
            </h3>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[#5C646C]">Shop ID</span>
                <input
                  type="text"
                  value={sellerNo}
                  readOnly
                  className="border border-[#E76F51] pb-1 rounded w-full max-w-[150px] text-dark bg-[#F4F4F4]"
                  placeholder="Shop ID"
                />
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[#5C646C]">Month</span>
                <input
                  type="text"
                  value={getMonthName(month)}
                  readOnly
                  className="border border-[#E76F51] p-1 rounded w-full max-w-[150px] text-dark bg-[#F4F4F4]"
                  placeholder="Month"
                />
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[#5C646C]">Year</span>
                <input
                  type="text"
                  value={year}
                  readOnly
                  className="border border-[#E76F51] p-1 rounded w-full max-w-[150px] text-dark bg-[#F4F4F4]"
                  placeholder="Year"
                />
              </div>
            </div>
          </div>

          {/* Income and Expenses Section */}
          <div className="bg-[#D9D9D9] p-4 rounded-md shadow-inner border-2 border-[#C0C0C0]">
            <h3 className="text-lg font-semibold mb-2 text-[#5C646C] border-b-2 border-[#C0C0C0] font-russo text-left">
              Income
            </h3>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[#5C646C]">Total Income</span>
                <input
                  type="number"
                  value={income}
                  onChange={handleIncomeChange}
                  className="border border-[#E76F51] p-1 rounded w-24 text-dark bg-[#F4F4F4]"
                  placeholder="Amount"
                  readOnly
                />
              </div>
            </div>

            <div className="bg-[#D9D9D9] p-4 rounded-md shadow-inner border-2 border-[#C0C0C0]">
              <h3 className="text-lg font-semibold mb-2 text-[#5C646C] border-b-2 border-[#C0C0C0] font-russo text-left">
                Balance Sheet
              </h3>
              <div className="grid grid-cols-2 gap-6">
                
                {/* Assets */}
                <div className="bg-[#D9D9D9] p-4 rounded-md border-2 border-[#C0C0C0]">
                  <h5 className="text-md font-semibold mb-2 text-[#5C646C] font-russo">
                    Assets
                  </h5>
                  {["purchasingCost", "storeMaintenance"].map((expense, index) => (
                    <div key={index} className="flex flex-col mb-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[#5C646C]">
                          {expense
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())}
                        </span>
                        <input
                          type="number"
                          name={expense}
                          value={expenses[expense] || ""}
                          onChange={(e) => {
                            // Ensure the first number is not 0
                            const value = e.target.value;
                            if (value === "" || /^[1-9][0-9]*$/.test(value)) {
                              handleExpenseChange(e);
                            }
                          }}
                          onFocus={() => {
                            
                            if (requiredFields.includes(expense) && !expenses[expense]) {
                              setExpenses((prevState) => ({
                                ...prevState,
                                [`${expense}Error`]: "This field is required",
                              }));
                            }
                          }}
                          onBlur={(e) => {
                            
                            handleExpenseChange(e);
                          }}
                          onKeyDown={(e) => {
                            // Prevent entering unwanted characters and 0 at the beginning
                            if (
                              ["e", "E", "+", "-", ".", " "].includes(e.key) ||
                              (e.key === "0" && e.target.value === "")
                            ) {
                              e.preventDefault();
                            }
                          }}
                          className={`border p-1 rounded w-24 text-dark ${
                            expenses[`${expense}Error`] ? "border-red-500" : "border-[#E76F51]"
                          } bg-[#F4F4F4]`}
                          placeholder="Amount"
                          min="1" 
                        />
                      </div>
                      {expenses[`${expense}Error`] && (
                        <p className="text-red-500 text-sm mt-1">
                          {expenses[`${expense}Error`]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Liabilities */}
                <div className="bg-[#D9D9D9] p-4 rounded-md border-2 border-[#C0C0C0]">
                  <h5 className="text-md font-semibold mb-2 text-[#5C646C] font-russo">
                    Liabilities
                  </h5>
                  {[
                    "electricityBill",
                    "internetBill",
                    "waterBill",
                    "employeeSalaries",
                    "marketingCost",
                  ].map((expense, index) => (
                    <div key={index} className="flex flex-col mb-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[#5C646C]">
                          {expense
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())}
                        </span>
                        <input
                          type="number"
                          name={expense}
                          value={expenses[expense] || ""}
                          onChange={(e) => {
                            // Ensure the first number is not 0
                            const value = e.target.value;
                            if (value === "" || /^[1-9][0-9]*$/.test(value)) {
                              handleExpenseChange(e);
                            }
                          }}
                          onFocus={() => {
                            
                            if (requiredFields.includes(expense) && !expenses[expense]) {
                              setExpenses((prevState) => ({
                                ...prevState,
                                [`${expense}Error`]: "This field is required",
                              }));
                            }
                          }}
                          onBlur={(e) => {
                            
                            handleExpenseChange(e);
                          }}
                          onKeyDown={(e) => {
                            // Prevent entering unwanted characters and 0 at the beginning
                            if (
                              ["e", "E", "+", "-", ".", " "].includes(e.key) ||
                              (e.key === "0" && e.target.value === "")
                            ) {
                              e.preventDefault();
                            }
                          }}
                          className={`border p-1 rounded w-24 text-dark ${
                            expenses[`${expense}Error`]
                              ? "border-red-500"
                              : "border-[#E76F51]"
                          } bg-[#F4F4F4]`}
                          placeholder="Amount"
                          min="1"
                        />
                      </div>
                      {expenses[`${expense}Error`] && (
                        <p className="text-red-500 text-sm mt-1">
                          {expenses[`${expense}Error`]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Petty Cash Section */}
            <div className="bg-[#D9D9D9] p-4 rounded-md shadow-inner border-2 border-[#C0C0C0] mt-4">
              <h3 className="text-lg font-semibold mb-2 text-[#5C646C] border-b-2 border-[#C0C0C0] font-russo text-left">
                Petty Cash
              </h3>
              {[
                "minorRepairs",
                "transportationCost",
                "bankFees",
                "courierFees",
                "officeSupplies",
              ].map((cash, index) => (
                <div key={index} className="flex flex-col mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[#5C646C]">
                      {cash
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                    </span>
                    <input
                      type="number"
                      name={cash}
                      value={pettyCash[cash]}
                      onChange={(e) => {
                        // Ensure the first number is not 0
                        const value = e.target.value;
                        if (value === "" || /^[1-9][0-9]*$/.test(value)) {
                          handlePettyCashChange(e);
                        }
                      }}
                      onFocus={() => {
                        if (requiredCashFields.includes(cash) && !pettyCash[cash]) {
                          setPettyCash((prevState) => ({
                            ...prevState,
                            [`${cash}Error`]: "This field is required",
                          }));
                        }
                      }}
                      onBlur={(e) => {
                        handlePettyCashChange(e);
                      }}
                      onKeyDown={(e) => {
                        // Prevent entering unwanted characters and 0 at the beginning
                        if (
                          ["e", "E", "+", "-", ".", " "].includes(e.key) ||
                          (e.key === "0" && e.target.value === "")
                        ) {
                          e.preventDefault();
                        }
                      }}
                      className={`border p-1 rounded w-24 text-dark ${
                        pettyCash[`${cash}Error`]
                          ? "border-red-500"
                          : "border-[#E76F51]"
                      } bg-[#F4F4F4]`}
                      placeholder="Amount"
                      min="1"
                    />
                  </div>
                  {pettyCash[`${cash}Error`] && (
                    <span className="text-red-500 text-sm">
                      {pettyCash[`${cash}Error`]}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Net Profit Section */}
            <div className="bg-[#D9D9D9] p-4 rounded-md shadow-inner border-2 border-[#C0C0C0] mt-4">
              <h3 className="text-lg font-semibold mb-2 text-[#5C646C] border-b-2 border-[#C0C0C0] font-russo text-left">
                Net Profit
              </h3>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[#5C646C]">Net Profit</span>
                <input
                  type="number"
                  value={netProfit}
                  readOnly
                  className="border border-[#E76F51] p-1 rounded w-24 text-dark bg-[#F4F4F4]"
                  placeholder="Amount"
                />
              </div>
            </div>
          </div>

          {/* Buttons Section */}
          <div className="flex justify-between items-center mt-6">
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-600 text-white py-2 px-4 rounded-lg"
            >
              Delete Report
            </button>
            <div className="flex">
              <button
                type="submit"
                className="bg-green-600 text-white py-2 px-4 rounded-lg mr-4"
              >
                {reportId ? "Update Report" : "Submit Report"}
              </button>
              <button
                type="button"
                onClick={() => window.history.back()}
                className="bg-gray-600 text-white py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BalanceSheet;
