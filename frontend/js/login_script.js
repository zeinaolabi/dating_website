const year = document.getElementById('year');
const month = document.getElementById('month');
const day = document.getElementById('day');

//Create a year drop down menu
const yearDropdown = () => {
    let year_start = 1900;
    let year_end = (new Date).getFullYear();

    let option = '';
    option = '<option>Year</option>';

    //Adding options from 1900 until current year
    for (let i = year_start; i <= year_end; i++) {
        option += '<option value="' + i + '">' + i + '</option>';
    }

    year.innerHTML = option;
};

//Create a month drop down menu
const monthDropdown = () => {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var month_selected = (new Date).getMonth();
    var option = '';
    option = '<option>Month</option>';

    //Adding an option for each month
    for (let i = 0; i < months.length; i++) {
        let month_number = (i + 1);

        //Add 0 for before value single digited numbers
        let month = (month_number <= 9) ? '0' + month_number : month_number;
        option += '<option value="' + month + '">' + months[i] + '</option>';
    }
    month.innerHTML = option;
};

//Create a day drop down menu 
const dayDropdown = () => {
    let option = '';
    option = '<option>Day</option>'; // first option

    //Adding an option for each day
    for (let i = 1; i < 32; i++) {
        //Add 0 before value for single digited numbers
        let day = (i <= 9) ? '0' + i : i;

        option += '<option value="' + day + '">' + day + '</option>';
    }
    day.innerHTML = option;
};

//Run functions
dayDropdown();
monthDropdown();
yearDropdown();