document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const packageName = urlParams.get('name');
    const pricePerPerson = parseFloat(urlParams.get('price'));

    document.getElementById('packageName').value = packageName;
    document.getElementById('pricePerPerson').value = `₹${pricePerPerson.toFixed(2)}`;

    const numOfPeopleInput = document.getElementById('numOfPeople');
    const totalAmountInput = document.getElementById('totalAmount');

    numOfPeopleInput.addEventListener('input', () => {
        const numOfPeople = parseInt(numOfPeopleInput.value);
        if (numOfPeople > 0) {
            const totalAmount = pricePerPerson * numOfPeople;
            totalAmountInput.value = `₹${totalAmount.toFixed(2)}`;
        } else {
            totalAmountInput.value = '';
        }
    });

    // Razorpay API Key
    const razorpayKey = "rzp_test_Am8Zi1bznoNdxl";

    // Move event listener OUTSIDE the form submit
    document.getElementById("pay-now-btn").addEventListener("click", function (e) {
        e.preventDefault();

        const leaderName = document.getElementById("leaderName").value;
        const mobileNumber = document.getElementById("mobileNumber").value;
        const email = document.getElementById("email").value;
        const address = document.getElementById("address").value || "N/A";
        const fromDate = document.getElementById("fromDate").value;
        const toDate = document.getElementById("toDate").value;
        const numOfPeople = parseInt(numOfPeopleInput.value);
        const totalAmount = pricePerPerson * numOfPeople * 100; // Convert to paise for Razorpay
        // const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');

        if (!leaderName || !mobileNumber || !email || !fromDate || !toDate || numOfPeople <= 0) {
            alert('Please fill out all required fields.');
            return;
        }

        const options = {
            key: razorpayKey,
            amount: totalAmount,
            currency: "INR",
            name: "Tourly - Travel Agency",
            description: "Payment for Travel Package",
            image: "https://your-website-logo.png",
            handler: function (response) {
                const queryParams = new URLSearchParams({
                    leaderName, mobileNumber, email, address, fromDate, toDate, numOfPeople, packageName, pricePerPerson, totalAmount
                }).toString();

                window.location.href = `receipt.html?${queryParams}`;
            },
            prefill: {
                name: leaderName,
                email: email,
                contact: mobileNumber,
            },
            theme: {
                color: "#3399cc",
            }
        };

        const rzp = new Razorpay(options);
        rzp.open();

        rzp.on("payment.failed", function (response) {
            alert("Payment failed! Please try again.");
            console.error(response.error);
        });
    });
});



document.addEventListener("DOMContentLoaded", function () {
    const fromDateInput = document.getElementById("fromDate");
    const toDateDisplay = document.getElementById("toDateDisplay");
    const toDateInput = document.getElementById("toDate");

    // Set the minimum "From Date" to today
    const today = new Date().toISOString().split("T")[0];
    fromDateInput.setAttribute("min", today);

    // Calculate and display the "To Date" when "From Date" changes
    fromDateInput.addEventListener("change", function () {
        const fromDate = new Date(fromDateInput.value);
        const toDate = new Date(fromDate);
        toDate.setDate(toDate.getDate() + 7); // Add 7 days for a 7-day package

        const formattedFromDate = fromDate.toISOString().split("T")[0];
        const formattedToDate = toDate.toISOString().split("T")[0];

        // Display the "To Date" to the user
        toDateDisplay.textContent = formattedToDate;

        // Set the hidden "To Date" input value for form submission
        toDateInput.value = formattedToDate;

        // Display the "To Date" to the user
        // toDateDisplay.textContent = toDate.toISOString().split("T")[0];

        // Set the hidden "To Date" input value for form submission
        // toDateInput.value = toDate.toISOString().split("T")[0];
    });
});