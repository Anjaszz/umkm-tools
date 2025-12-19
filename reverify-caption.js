
async function verify() {
    try {
        console.log('Testing Text Only...');
        const res1 = await fetch('http://localhost:3000/api/generate-caption', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: 'Test Caption for Store: MyStore',
            }),
        });
        const data1 = await res1.json();
        console.log('Status 1:', res1.status);
        if (!res1.ok) {
            console.log('Error Details:', data1.details);
            // console.log('Stack:', data1.stack); // Stack might be too long, omit for now
        } else {
            console.log('Success');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

verify();
