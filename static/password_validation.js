var myInput = document.getElementById("password");
var letter = document.getElementById("lower");
var capital = document.getElementById("upper");
var number = document.getElementById("number");
var length = document.getElementById("length");
var special = document.getElementById('special')

// When the user starts to type something inside the password field
myInput.onkeyup = function() {
    // Validate lowercase letters
    var lowerCaseLetters = /[a-z]/g;
    if(myInput.value.match(lowerCaseLetters)) {
        letter.classList.remove("invalid");
        letter.classList.add("valid");
    } else {
        letter.classList.remove("valid");
        letter.classList.add("invalid");
    }

    // Validate capital letters
    var upperCaseLetters = /[A-Z]/g;
    if(myInput.value.match(upperCaseLetters)) {
        capital.classList.remove("invalid");
        capital.classList.add("valid");
    } else {
        capital.classList.remove("valid");
        capital.classList.add("invalid");
    }

    // Validate numbers
    var numbers = /[0-9]/g;
    if(myInput.value.match(numbers)) {
        number.classList.remove("invalid");
        number.classList.add("valid");
    } else {
        number.classList.remove("valid");
        number.classList.add("invalid");
    }

    // Validate length
    if(myInput.value.length >= 8 && myInput.value.length <= 20) {
        length.classList.remove("invalid");
        length.classList.add("valid");
    } else {
        length.classList.remove("valid");
        length.classList.add("invalid");
    }

    var specialCar = /[-!$%^&*()_+|~=`{}[:;<>?,.@#\]]/g
    if (myInput.value.match(specialCar)){
        special.classList.remove('invalid')
        special.classList.add('valid')
    } else {
        special.classList.remove('valid')
        special.classList.add('invalid')
    }
}