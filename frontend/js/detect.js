
document.addEventListener('DOMContentLoaded', function () {

    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const imagePreview = document.getElementById('imagePreview');
    const uploadForm = document.getElementById('uploadForm');
    const fileNameDisplay = document.getElementById('fileName');
    const logoutBtn = document.getElementById('logoutBtn');

    const token = localStorage.getItem('authToken') ||
                  sessionStorage.getItem('authToken');

    // Check authentication
    if (!token) {
        alert('Please log in before detecting a disease.');
        window.location.href = 'login.html';
        return;
    }

    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {

            localStorage.removeItem('authToken');
            localStorage.removeItem('currentUser');

            sessionStorage.removeItem('authToken');
            sessionStorage.removeItem('currentUser');

            window.location.href = 'login.html';
        });
    }


    // Open file selector
    if (uploadArea && fileInput) {

        uploadArea.addEventListener('click', function () {
            fileInput.click();
        });

    }


    // Handle file selection
    if (fileInput) {

        fileInput.addEventListener('change', function () {

            const file = this.files[0];

            if (file) {
                handleFile(file);
            }

        });

    }


    // Drag and drop events
    if (uploadArea) {

        uploadArea.addEventListener('dragover', function (event) {

            event.preventDefault();
            this.classList.add('dragover');

        });


        uploadArea.addEventListener('dragleave', function (event) {

            event.preventDefault();
            this.classList.remove('dragover');

        });


        uploadArea.addEventListener('drop', function (event) {

            event.preventDefault();
            this.classList.remove('dragover');

            const files = event.dataTransfer.files;

            if (files.length > 0) {

                const file = files[0];

                if (!fileInput) return;

                if (!file.type.startsWith('image/')) {
                    alert('Please upload an image file.');
                    return;
                }

                fileInput.files = files;
                handleFile(file);

            }

        });

    }


    // Validate and preview selected image
    function handleFile(file) {

        const validTypes = [
            'image/jpeg',
            'image/png'
        ];

        if (!validTypes.includes(file.type)) {

            alert('Please upload a JPG, JPEG, or PNG image.');

            resetImage();

            return;
        }


        if (file.size > 5 * 1024 * 1024) {

            alert('File size exceeds 5MB limit.');

            resetImage();

            return;
        }


        if (fileNameDisplay) {
            fileNameDisplay.textContent = file.name;
        }


        if (imagePreview) {

            const reader = new FileReader();

            reader.onload = function (event) {

                imagePreview.src = event.target.result;
                imagePreview.classList.remove('d-none');

            };

            reader.readAsDataURL(file);

        }

    }


    // Clear selected image
    function resetImage() {

        if (fileInput) {
            fileInput.value = '';
        }

        if (imagePreview) {
            imagePreview.src = '#';
            imagePreview.classList.add('d-none');
        }

        if (fileNameDisplay) {
            fileNameDisplay.textContent = '';
        }

    }


    // Submit image for AI prediction
    if (uploadForm) {

        uploadForm.addEventListener('submit', async function (event) {

            event.preventDefault();

            const file = fileInput?.files[0];

            if (!file) {

                alert('Please select an image first.');
                return;

            }


            const submitBtn = uploadForm.querySelector(
                'button[type="submit"]'
            );

            const originalText = submitBtn
                ? submitBtn.innerHTML
                : '';


            if (submitBtn) {

                submitBtn.disabled = true;

                submitBtn.innerHTML =
                    '<span class="spinner-border spinner-border-sm me-2"></span> Analysing...';

            }


            const formData = new FormData();

            formData.append('image', file);


            try {

                const response = await fetch(
                    'http://localhost:5000/api/predict',
                    {
                        method: 'POST',

                        headers: {
                            'Authorization': `Bearer ${token}`
                        },

                        body: formData
                    }
                );


                const data = await response.json();


                if (response.status === 401) {

                    localStorage.removeItem('authToken');
                    localStorage.removeItem('currentUser');

                    sessionStorage.removeItem('authToken');
                    sessionStorage.removeItem('currentUser');

                    alert(
                        'Your session has expired. Please log in again.'
                    );

                    window.location.href = 'login.html';

                    return;
                }


                if (!response.ok || !data.success) {

                    alert(data.message || 'Image prediction failed.');

                    return;
                }


                // Store prediction result
                sessionStorage.setItem(
                    'predictionResult',
                    JSON.stringify(data.result)
                );


                sessionStorage.setItem(
                    'predictionValidation',
                    JSON.stringify(data.validation)
                );


                sessionStorage.setItem(
                    'predictionId',
                    data.prediction_id
                );


                // Navigate to result page
                window.location.href = 'result.html';


            } catch (error) {

                console.error('Prediction error:', error);

                alert(
                    'Unable to connect to the server. Please try again.'
                );

            } finally {

                if (submitBtn) {

                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;

                }

            }

        });

    }

});
