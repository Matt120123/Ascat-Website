fetch('http://localhost:5501/submit-form', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ test: 'data' })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
