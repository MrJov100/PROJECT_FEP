<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <title>Sign Up</title>
</head>
<body>
    <div class="container mt-5">
        <h2 class="text-center">Sign Up</h2>
        <form id="signupForm" method="POST" action="{{ route('signup') }}">
            @csrf
            <div class="mb-3">
                <label for="name" class="form-label">Name</label>
                <input type="text" class="form-control" id="name" name="name" required>
            </div>
            <div class="mb-3">
                <label for="email" class="form-label">Email address</label>
                <input type="email" class="form-control" id="email" name="email" required>
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" name="password" required>
            </div>
            <div class="mb-3">
                <label for="password_confirmation" class="form-label">Confirm Password</label>
                <input type="password" class="form-control" id="password_confirmation" name="password_confirmation" required>
            </div>
            <button type="submit" class="btn btn-primary w-100">Sign Up</button>
        </form>
        <p class="mt-3 text-center">Already have an account? <a href="{{ route('login') }}">Login</a></p>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        document.getElementById('signupForm').addEventListener('submit', function(event) {
            var password = document.getElementById('password').value;
            var passwordConfirmation = document.getElementById('password_confirmation').value;

            // Check if passwords match
            if (password !== passwordConfirmation) {
                event.preventDefault(); // Prevent form submission
                alert('Password and confirmation do not match!'); // Show alert
            }

            // If passwords match, use AJAX to submit the form and check for email existence
            if (password === passwordConfirmation) {
                event.preventDefault(); // Prevent default form submission
                
                var formData = new FormData(this);
                
                fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest', // Add this to indicate it's an AJAX request
                    }
                })
                .then(response => response.json())
.then(data => {
    if (data.status === 'error') {
        alert(data.message); // Show error if email is already registered
    } else {
        alert(data.message); // Show success message
        setTimeout(() => {
            window.location.href = data.redirect_url; // Redirect to the login page
        }, 2000); // Delay of 2 seconds
    }
})
.catch(error => {
    console.error('Error:', error);
});
            }
        });
    </script>
</body>
</html>
