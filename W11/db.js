let users=JSON.parse(localStorage.getItem("users"))||[];
const registerBtn =
    document.getElementById("registerBtn");

if(registerBtn){
    registerBtn.addEventListener(
        "click",
        registerUser
    );
}


/* LOGIN */
const loginBtn =
    document.getElementById("loginBtn");

if(loginBtn){
    loginBtn.addEventListener(
        "click",
        loginUser
    );
}

function registerUser(){

    const name =
        document.getElementById("name").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const mobile =
        document.getElementById("mobile").value.trim();

    const dob =
        document.getElementById("dob").value;

    const city =
        document.getElementById("city").value.trim();

    const address =
        document.getElementById("address").value.trim();

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value.trim();

    const result =
        document.getElementById("result");

      const nameRegex=/^[A-Za-z ]+$/;
      const emailRegex=/^\S+@\S+\.\S+$/;
      const mobileRegex=/^[0-9]{10}$/;

      if(!nameRegex.test(name)){
        result.innerHTML="Invalid name";
        return;
      }
       if(!emailRegex.test(email)){
        result.innerHTML = "Invalid email";
        return;
    }

    if(!mobileRegex.test(mobile)){
        result.innerHTML = "Invalid mobile";
        return;
    }

    if(password.length < 6){
        result.innerHTML =
            "Password must be 6 chars";
        return;
    }
     if (!name || !email || !mobile || !dob || !city || !address || !username || !password) {
      result.innerHTML = "All Fields required";
      return;
    }

    const existingUser=users.find(
        user=>user.username===username && user.email===email
    )
    if(existingUser){
        result.innerHTML =
            "<p style='color:red'>User already exists</p>";
        return;
    }
    const xhr=new XMLHttpRequest();
    xhr.open("POST","users.json",true);

    xhr.onload=function(){
         const newUser = {
            id: Date.now(),
            name,
            email,
            mobile,
            dob,
            city,
            address,
            username,
            password
        };

        users.push(newUser);
        localStorage.setItem(
            "users",JSON.stringify(users)
        );
        setTimeout(()=>{
            window.location.href="login.html";
        },1000)
        document.querySelector("form").reset();
    };

xhr.send();

    
}

function loginUser(){

    const username =
        document.getElementById("loginUser").value.trim();

    const password =
        document.getElementById("loginPass").value.trim();

    const result =
        document.getElementById("result");

    const xhr = new XMLHttpRequest();

    xhr.open("POST","users.json",true);

    xhr.onload = function(){

        const user =
            users.find(u =>
                u.username === username &&
                u.password === password
            );
        
        if(user){
            result.innerHTML =
                "<p style='color:green'>Login Successful</p>";

            setTimeout(()=>{
               window.location.href="users.html";
            },1000);
        }
        else{
            result.innerHTML =
                "<p style='color:red'>Invalid Credentials</p>";
        }
    };

    xhr.send();
}