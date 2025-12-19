
async function verify() {
    try {
        const response = await fetch('http://localhost:3000/api/generate-description', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: 'Test Description Prompt',
            }),
        });

        const data = await response.json();
        console.log('Desc Status:', response.status);
        console.log('Desc Response:', data);
    } catch (error) {
        console.error('Desc Error:', error);
    }
}

verify();
